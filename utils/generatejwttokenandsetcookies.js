import jwt from 'jsonwebtoken';

export const GenerateJwtTokenAndSetCookiesEmployee = (res, EMid, EMrole, organizationId) => {
    const token = jwt.sign({ EMid, EMrole, organizationId }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie("EMtoken", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // secure: true,
        // sameSite: "none",
        secure: false,    // ✅ must be false for localhost
        sameSite: "Lax",
    });

    return token;
};

export const GenerateJwtTokenAndSetCookiesHR = (res, HRid, HRrole, organizationId) => {
    const token = jwt.sign({ HRid, HRrole, organizationId }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie("HRtoken", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
       // secure: true,
        // sameSite: "none",
         secure: false,    // ✅ must be false for localhost
        sameSite: "Lax",
    });

    return token;
};
