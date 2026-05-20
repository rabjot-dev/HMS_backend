const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        console.log("TOKEN RECEIVED:", token);
        console.log("JWT SECRET:", process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  
        next();
    } catch (e) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

const verifyAdmin = (req, res, next) => {
    const allowedRoles = ["Admin", "Owner"];

    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
};

module.exports = { verifyToken, verifyAdmin };