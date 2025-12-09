import {v4 as uuidv4} from "uuid";
import Guest from "../models/Guest.js";

export const guestMiddleware = async (req, res, next) => {
    try {
        if (req.user) return next(); // skip if logged in

        const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
        let guestId = req.cookies.guestId;

        let guest = null;

        // 1. If guestId cookie exists → load that guest
        if (guestId) {
            guest = await Guest.findOne({where: {guestId}});
        }

        // 2. If no guest from cookie → try IP address
        if (!guest) {
            guest = await Guest.findOne({where: {ipAddress: ip}});
            if (guest) {
                guestId = guest.guestId;

                // Restore cookie since it was deleted
                res.cookie("guestId", guest.guestId, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 30
                });
            }
        }

        // 3. If STILL no guest → create new
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
