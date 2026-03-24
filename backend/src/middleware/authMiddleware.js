import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token; // assuming token is in cookies
        if (!token) return res.status(401).json({message: "Unauthorized"});

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        const user = await User.findByPk(decoded.id);
        if (!user) return res.status(401).json({message: "Unauthorized"});

        req.user = user; // attach the user to the request
        next();
    } catch (err) {
        return res.status(401).json({message: "Unauthorized"});
    }
};
