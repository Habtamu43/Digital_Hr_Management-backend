import jwt from "jsonwebtoken";

export const GenerateJwtTokenAndSetCookiesEmployee = (
  res,
  EMid,
  EMrole,
  organizationId,
) => {
  // Check if we are in production
  const isProduction = process.env.NODE_ENV === "production";

  const token = jwt.sign(
    { EMid, EMrole, organizationId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("EMtoken", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    // CRITICAL FOR VERCEL + RENDER:
    secure: true, // Must be true for HTTPS (Render)
    sameSite: "none", // Must be "none" for cross-domain
  });

  return token;
};

export const GenerateJwtTokenAndSetCookiesHR = (
  res,
  HRid,
  HRrole,
  organizationId,
) => {
  const token = jwt.sign(
    { HRid, HRrole, organizationId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("HRtoken", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    // CRITICAL FOR VERCEL + RENDER:
    secure: true, // Must be true for HTTPS (Render)
    sameSite: "none", // Must be "none" for cross-domain
  });

  return token;
};
