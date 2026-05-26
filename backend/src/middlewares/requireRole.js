function requireRole(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return function roleGuard(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ message: "Missing authenticated user" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient role for this action" });
    }

    return next();
  };
}

module.exports = requireRole;