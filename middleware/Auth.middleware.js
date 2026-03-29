import jwt from "jsonwebtoken";

/* ===================== EMPLOYEE TOKEN ===================== */
export const VerifyEmployeeToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Get token from cookie or Authorization header
    const token =
      req.cookies?.EMtoken ||
      (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        gologin: true,
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Organization ID from HR token:", decoded.organizationId);
    // Attach decoded values to req object
    req.EMid = decoded.EMid;
    req.EMrole = decoded.EMrole;
    req.organizationId = decoded.organizationId; // ✅ standardized

    // Ensure organizationId exists
    if (!req.organizationId) {
      return res.status(401).json({
        success: false,
        message: "Organization ID missing in token",
        gologin: true,
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      gologin: true,
    });
  }
};

/* ===================== HR TOKEN ===================== */
// Corrected middleware name
export const VerifyHRToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      req.cookies?.HRtoken ||
      (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        gologin: true,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded HR token:", decoded);

    req.HRid = decoded.HRid;
    req.HRrole = decoded.HRrole;
    req.organizationId = decoded.organizationId;

    if (!req.organizationId) {
      return res.status(401).json({
        success: false,
        message: "Organization ID missing in token",
        gologin: true,
      });
    }

    next();
  } catch (error) {
    console.error("HR token error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      gologin: true,
    });
  }
};
