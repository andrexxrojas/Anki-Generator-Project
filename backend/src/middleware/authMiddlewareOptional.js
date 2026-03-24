import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddlewareOptional = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return next(); // no token → just continues as guest

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        const user = await User.findByPk(decoded.id);
        if (user) req.user = user;

        next();
    } catch (err) {
        // If token is invalid, just continue as guest
        next();
    }
};
