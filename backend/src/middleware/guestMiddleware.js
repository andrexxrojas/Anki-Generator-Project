import {v4 as uuidv4} from "uuid";
import Guest from "../models/Guest.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const guestMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findByPk(decoded.id);
                if (user) {
                    req.user = user;
                    return next();
                }
            } catch (err) {
                // Token invalid, proceed with guest logic
            }
        }

        const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
        let guestId = req.cookies.guestId;

        let guest = null;

        if (guestId) {
            guest = await Guest.findOne({where: {guestId}});
        }

        if (!guest) {
            guest = await Guest.findOne({where: {ipAddress: ip}});
            if (guest) {
                guestId = guest.guestId;

                res.cookie("guestId", guest.guestId, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 30
                });
            }
        }

        if (!guest) {
            guestId = uuidv4();
            guest = await Guest.create({
                guestId,
                ipAddress: ip
            });

            res.cookie("guestId", guestId, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 30
            });
        }

        req.guest = guest;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Guest tracking error"});
    }
};
