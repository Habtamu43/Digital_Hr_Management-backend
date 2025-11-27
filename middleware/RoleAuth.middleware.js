// RoleAuth.middleware.js
export const RoleAuthorization = (...AuthRoles) => {
  return (req, res, next) => {
    if (!AuthRoles.includes(req.Role)) {
      return res.status(403).json({ 
        success: false, 
        message: "You are not authorized to access this route" 
      });
    }
    next();
  };
};
