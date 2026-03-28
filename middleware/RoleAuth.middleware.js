// RoleAuth.middleware.js
export const RoleAuthorization = (...allowedRoles) => {
  return (req, res, next) => {
    // 🔒 Ensure role exists (set by VerifyHRToken)
    if (!req.HRrole) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
        gologin: true,
      });
    }

    // 🔐 Check role permission
    if (!allowedRoles.includes(req.HRrole)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this route",
      });
    }

    next();
  };
};
