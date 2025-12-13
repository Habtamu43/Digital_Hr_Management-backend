// Auth.middleware.js
import jwt from "jsonwebtoken";

// ==================== Employee Token Verification ====================
export const VerifyEmployeeToken = (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check cookie first
    if (req.cookies?.EMtoken) {
      token = req.cookies.EMtoken;
    }

    // 2️⃣ Fallback: check Authorization header
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1]; // Bearer <token>
    }

    // 3️⃣ No token provided
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access: no token provided",
        gologin: true,
      });
    }

    // 4️⃣ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: "Unauthenticated employee",
        gologin: true,
      });
    }

    // 5️⃣ Set request properties for controller
    req.EMid = decoded.EMid;
    req.EMrole = decoded.EMrole;
    req.ORGID = decoded.ORGID;

    next();
  } catch (error) {
    console.error("VERIFY EMPLOYEE TOKEN ERROR:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized access: invalid token",
      gologin: true,
    });
  }
};

// ==================== HR Token Verification ====================
export const VerifyHRToken = (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check cookie first
    if (req.cookies?.HRtoken) {
      token = req.cookies.HRtoken;
    }

    // 2️⃣ Fallback: check Authorization header
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1]; // Bearer <token>
    }

    // 3️⃣ No token provided
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access: no HR token provided",
        gologin: true,
      });
    }

    // 4️⃣ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: "Unauthenticated HR",
        gologin: true,
      });
    }

    // 5️⃣ Set request properties for controller
    req.HRid = decoded.HRid;
    req.HRrole = decoded.HRrole;
    req.ORGID = decoded.ORGID;

    next();
  } catch (error) {
    console.error("VERIFY HR TOKEN ERROR:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized access: invalid HR token",
      gologin: true,
    });
  }
};
