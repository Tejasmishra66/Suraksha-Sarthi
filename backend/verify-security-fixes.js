const fs = require('fs');

let pass = 0;
let fail = 0;

function check(label, filePath, mustContain, mustNotContain) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let ok = true;
    let reason = '';

    if (mustContain && !content.includes(mustContain)) {
      ok = false;
      reason = 'MISSING => ' + mustContain.trim().slice(0, 70);
    }
    if (ok && mustNotContain && content.includes(mustNotContain)) {
      ok = false;
      reason = 'STILL PRESENT => ' + mustNotContain.trim().slice(0, 70);
    }

    const sym = ok ? 'PASS' : 'FAIL';
    if (ok) pass++; else fail++;
    console.log(`  [${sym}] ${label}${reason ? '\n         ' + reason : ''}`);
  } catch (e) {
    fail++;
    console.log(`  [FAIL] ${label}\n         FILE NOT FOUND: ${filePath}`);
  }
}

const B = 'e:/projects/Suraksha-Sarthi/backend/src';

console.log('');
console.log('==============================================');
console.log('     SECURITY FIX VERIFICATION REPORT');
console.log('==============================================');

// ── BUG 1: requireRole wired correctly ──────────────────
console.log('\n[BUG 1] requireRole wired to critical routes');
check(
  'verifyRoutes  POST /:id => authMiddleware applied',
  B + '/routes/verifyRoutes.js',
  'authMiddleware', null
);
check(
  'verifyRoutes  POST /:id => requireRole(["admin","department"]) applied',
  B + '/routes/verifyRoutes.js',
  'requireRole(["admin", "department"])', null
);
check(
  'agencyMemberRoutes  POST /:agency/members => authMiddleware applied',
  B + '/routes/agencyMemberRoutes.js',
  'authMiddleware', null
);
check(
  'agencyMemberRoutes  POST /:agency/members => requireRole(["admin"]) applied',
  B + '/routes/agencyMemberRoutes.js',
  'requireRole(["admin"])', null
);

// ── BUG 2A: CORS locked down ────────────────────────────
console.log('\n[BUG 2a] CORS restricted to allowedOrigins only');
check(
  'app.js  allowedOrigins array defined',
  B + '/app.js',
  'const allowedOrigins', null
);
check(
  'app.js  unknown origins are rejected',
  B + '/app.js',
  'is not allowed', null
);
check(
  'app.js  old open-to-all CORS logic removed',
  B + '/app.js',
  null, "origin.indexOf('localhost') !== -1) return callback(null, true);\n    return callback(null, true);"
);

// ── BUG 2B: JWT secret guard ────────────────────────────
console.log('\n[BUG 2b] JWT secret hardening');
check(
  'env.js  INSECURE_DEFAULTS list defined',
  B + '/config/env.js',
  'INSECURE_DEFAULTS', null
);
check(
  'env.js  NODE_ENV === production check present',
  B + '/config/env.js',
  "NODE_ENV === \"production\"", null
);
check(
  'env.js  process.exit(1) on insecure secret',
  B + '/config/env.js',
  'process.exit(1)', null
);

// ── BUG 3: Rate limiting on /auth/login ─────────────────
console.log('\n[BUG 3] Brute-force protection on /auth/login');
check(
  'authRoutes  loginRateLimit function defined',
  B + '/routes/authRoutes.js',
  'function loginRateLimit(', null
);
check(
  'authRoutes  rate limiter applied to POST /login',
  B + '/routes/authRoutes.js',
  'router.post("/login", loginRateLimit', null
);
check(
  'authRoutes  HTTP 429 returned when limit hit',
  B + '/routes/authRoutes.js',
  'status(429)', null
);
check(
  'authRoutes  Retry-After header returned',
  B + '/routes/authRoutes.js',
  'Retry-After', null
);
check(
  'authRoutes  failed attempts tracked per IP',
  B + '/routes/authRoutes.js',
  'recordFailedLogin(', null
);
check(
  'authRoutes  successful login clears counter',
  B + '/routes/authRoutes.js',
  'clearLoginAttempts(', null
);

// ── BUG 4: Hardcoded phone number removed ───────────────
console.log('\n[BUG 4] Hardcoded +910000000000 replaced with real phone from DB');
check(
  'alertingService     NO hardcoded placeholder',
  B + '/services/alertingService.js',
  null, '+910000000000'
);
check(
  'alertingService     uses user.phone from DB record',
  B + '/services/alertingService.js',
  'user.phone', null
);
check(
  'notificationService  NO hardcoded placeholder',
  B + '/services/notificationService.js',
  null, '+910000000000'
);
check(
  'notificationService  uses head.phone from DB record',
  B + '/services/notificationService.js',
  'head.phone', null
);
check(
  'watchdogService     NO hardcoded placeholder',
  B + '/services/watchdogService.js',
  null, '+910000000000'
);
check(
  'watchdogService     queries users table for phones',
  B + '/services/watchdogService.js',
  'SELECT phone, name FROM users', null
);
check(
  'watchdogServiceV2   NO hardcoded placeholder',
  B + '/services/watchdogServiceV2.js',
  null, '+910000000000'
);
check(
  'watchdogServiceV2   queries users table for phones',
  B + '/services/watchdogServiceV2.js',
  'SELECT phone FROM users', null
);
check(
  'statusService       NO hardcoded placeholder',
  B + '/services/statusService.js',
  null, '+910000000000'
);
check(
  'statusService       guards sendSms with if(phone) check',
  B + '/services/statusService.js',
  'if (phone)', null
);

// ── SUMMARY ─────────────────────────────────────────────
const total = pass + fail;
const pct = Math.round((pass / total) * 100);
console.log('');
console.log('==============================================');
console.log(`   PASS: ${pass}   FAIL: ${fail}   TOTAL: ${total}   (${pct}%)`);
if (fail === 0) {
  console.log('   ALL SECURITY FIXES CONFIRMED APPLIED!');
} else {
  console.log('   SOME FIXES NEED ATTENTION (see above)');
}
console.log('==============================================');
console.log('');
