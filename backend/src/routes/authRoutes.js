const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("../db/database");
const env = require("../config/env");

const router = express.Router();

router.post("/login", (req, res) => {
  // Issues JWT token for dashboard/mobile clients.
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const validPassword = bcrypt.compareSync(password, user.password_hash);
  if (!validPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

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
      email: user.email
    }
  });
});

router.post("/register", (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    department,
    address,
    place,
    district
  } = req.body;

  if (!name || !email || !password || !phone || !department || !address || !place || !district) {
    return res.status(400).json({
      message: "name, email, password, phone, department, address, place, and district are required"
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existingUser = db.prepare("SELECT id FROM users WHERE email = ?").get(normalizedEmail);

  if (existingUser) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  const passwordHash = bcrypt.hashSync(String(password), 10);
  const normalizedDepartment = String(department).trim();
  const result = db
    .prepare(
      "INSERT INTO users (name, email, password_hash, role, agency, department, phone, address, place, district) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .run(
      String(name).trim(),
      normalizedEmail,
      passwordHash,
      "member",
      normalizedDepartment,
      normalizedDepartment,
      String(phone).trim(),
      String(address).trim(),
      String(place).trim(),
      String(district).trim()
    );

  return res.status(201).json({
    userId: result.lastInsertRowid,
    message: "Account created successfully"
  });
});

module.exports = router;
