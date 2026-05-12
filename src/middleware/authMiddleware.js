const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // { id, role, email } now available in controller
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