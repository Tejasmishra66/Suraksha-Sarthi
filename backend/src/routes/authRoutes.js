const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("../db/database");
const env = require("../config/env");
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");
const { z } = require("zod");

const router = express.Router();

// ─── In-process login rate limiter ───────────────────────────────────────────
// Tracks failed login attempts per IP. Resets after WINDOW_MS.
// No external package required — suitable for single-instance deployments.
const loginAttempts = new Map();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function loginRateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (entry && entry.count >= MAX_ATTEMPTS) {
    const elapsed = now - entry.firstAttempt;
    if (elapsed < WINDOW_MS) {
      const retryAfterSec = Math.ceil((WINDOW_MS - elapsed) / 1000);
      res.set('Retry-After', String(retryAfterSec));
      return res.status(429).json({
        message: `Too many login attempts. Please try again in ${Math.ceil(retryAfterSec / 60)} minute(s).`
      });
    }
    // Window expired — reset the counter.
    loginAttempts.delete(ip);
  }
  next();
}

function recordFailedLogin(ip) {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
  } else {
    entry.count += 1;
  }
}

function clearLoginAttempts(ip) {
  loginAttempts.delete(ip);
}
// ─────────────────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

router.post("/login", loginRateLimit, (req, res) => {
  // Validate input using Zod
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ 
      message: "Validation error", 
      errors: validation.error.flatten().fieldErrors 
    });
  }
  const { email, password } = validation.data;

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) {
    recordFailedLogin(req.ip || req.connection.remoteAddress || 'unknown');
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const validPassword = bcrypt.compareSync(password, user.password_hash);
  if (!validPassword) {
    recordFailedLogin(req.ip || req.connection.remoteAddress || 'unknown');
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Successful login — clear the fail counter so the user is not locked out.
  clearLoginAttempts(req.ip || req.connection.remoteAddress || 'unknown');

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      agency: user.agency,
      department: user.department,
      place: user.place,
      district: user.district,
      name: user.name,
      email: user.email
    },
    env.jwtSecret,
    { expiresIn: "12h" }
  );

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      agency: user.agency,
      department: user.department,
      place: user.place,
      district: user.district,
      email: user.email,
      phone: user.phone
    }
  });
});

const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "agency_head", "user", "volunteer"], { errorMap: () => ({ message: "Invalid role" }) }),
  department: z.string().optional().nullable(),
  phone: z.string().min(10, "Phone number is required"),
  address: z.string().optional().nullable(),
  place: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
});

router.post("/create-user", auth, requireRole("admin"), (req, res) => {
  const validation = createUserSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ 
      message: "Validation error", 
      errors: validation.error.flatten().fieldErrors 
    });
  }

  const {
    name,
    email,
    password,
    role,
    department,
    phone,
    address,
    place,
    district
  } = validation.data;

  const normalizedEmail = String(email).trim().toLowerCase();
  const existingUser = db.prepare("SELECT id FROM users WHERE email = ?").get(normalizedEmail);

  if (existingUser) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  const passwordHash = bcrypt.hashSync(String(password), 10);
  const normalizedDepartment = department ? String(department).trim() : null;
  
  try {
    const result = db
      .prepare(
        "INSERT INTO users (name, email, password_hash, role, agency, department, phone, address, place, district) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      )
      .run(
        String(name).trim(),
        normalizedEmail,
        passwordHash,
        role,
        normalizedDepartment,
        normalizedDepartment,
        phone ? String(phone).trim() : null,
        address ? String(address).trim() : null,
        place ? String(place).trim() : null,
        district ? String(district).trim() : null
      );

    return res.status(201).json({
      user: {
        id: result.lastInsertRowid,
        name: String(name).trim(),
        role: role,
        agency: normalizedDepartment,
        email: normalizedEmail
      },
      message: "User created successfully by admin"
    });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' || error.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ message: "An account with this email already exists" });
    }
    console.error("[Create-User Error]:", error);
    return res.status(500).json({ message: "Internal server error during user creation" });
  }
});

// ─── OTP Store (in-memory, per phone number) ─────────────────────────────────
// Maps phone → { otp, expiresAt, verified }
const otpStore = new Map();
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendSmsOTP(phone, otp) {
  const env = require("../config/env");

  if (env.twilioEnabled && env.twilioAccountSid && env.twilioAuthToken) {
    try {
      const twilio = require("twilio");
      const client = twilio(env.twilioAccountSid, env.twilioAuthToken);
      await client.messages.create({
        body: `Your Suraksha Sarthi OTP is: ${otp}. Valid for 10 minutes. Do not share with anyone.`,
        from: env.twilioFrom,
        to: phone,
      });
      return { sent: true, via: "twilio" };
    } catch (err) {
      console.error("[OTP] Twilio send failed:", err.message);
      return { sent: false, error: err.message };
    }
  }

  // Dev fallback — log OTP to console
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[OTP DEV] Phone: ${phone} → OTP: ${otp}`);
  }
  return { sent: true, via: "console" };
}

// POST /auth/send-otp
router.post("/send-otp", loginRateLimit, async (req, res) => {
  const { phone } = req.body;
  if (!phone || String(phone).trim().length < 10) {
    return res.status(400).json({ message: "A valid phone number is required" });
  }

  const normalizedPhone = String(phone).trim();
  const otp = generateOTP();
  const expiresAt = Date.now() + OTP_EXPIRY_MS;

  otpStore.set(normalizedPhone, { otp, expiresAt, verified: false });

  const result = await sendSmsOTP(normalizedPhone, otp);

  return res.json({
    message: "OTP sent successfully. Please check your phone.",
    dev: result.via === "console" ? `[DEV MODE] OTP: ${otp}` : undefined,
  });
});

// POST /auth/verify-otp
router.post("/verify-otp", loginRateLimit, (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ message: "Phone and OTP are required" });
  }

  const normalizedPhone = String(phone).trim();
  const entry = otpStore.get(normalizedPhone);

  if (!entry) {
    return res.status(400).json({ message: "No OTP found for this number. Please request a new one." });
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(normalizedPhone);
    return res.status(400).json({ message: "OTP has expired. Please request a new one." });
  }

  if (entry.otp !== String(otp).trim()) {
    return res.status(400).json({ message: "Incorrect OTP. Please try again." });
  }

  // Mark phone as verified (so signup can proceed)
  entry.verified = true;
  otpStore.set(normalizedPhone, entry);

  return res.json({ message: "Phone number verified successfully.", verified: true });
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number is required"),
  address: z.string().optional().nullable(),
  place: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
});

router.post("/signup", loginRateLimit, (req, res) => {
  const validation = signupSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ 
      message: "Validation error", 
      errors: validation.error.flatten().fieldErrors 
    });
  }

  const { name, email, password, phone, address, place, district } = validation.data;
  const normalizedPhone = String(phone).trim();

  // Require phone to be OTP-verified before creating account
  // const otpEntry = otpStore.get(normalizedPhone);
  // if (!otpEntry || !otpEntry.verified) {
  //   return res.status(403).json({ message: "Phone number must be verified via OTP before registering." });
  // }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existingUser = db.prepare("SELECT id FROM users WHERE email = ?").get(normalizedEmail);

  if (existingUser) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  const passwordHash = bcrypt.hashSync(String(password), 10);
  // Force role to 'user' for public signups, no agency/department assigned.
  const forcedRole = "user"; 

  try {
    const result = db
      .prepare(
        "INSERT INTO users (name, email, password_hash, role, phone, address, place, district) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      )
      .run(
        String(name).trim(),
        normalizedEmail,
        passwordHash,
        forcedRole,
        normalizedPhone,
        address ? String(address).trim() : null,
        place ? String(place).trim() : null,
        district ? String(district).trim() : null
      );

    // Clear the OTP entry after successful registration
    otpStore.delete(normalizedPhone);

    return res.status(201).json({
      message: "Account created successfully. You can now log in.",
      user: {
        id: result.lastInsertRowid,
        name: String(name).trim(),
        role: forcedRole,
        email: normalizedEmail
      }
    });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' || error.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ message: "An account with this email already exists" });
    }
    console.error("[Signup Error]:", error);
    return res.status(500).json({ message: "Internal server error during registration" });
  }
});

module.exports = router;
