import { v4 as uuidv4 } from "uuid";
import crypto from 'crypto';
import Guest from "../models/Guest.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// In-memory rate limiting (use Redis for production)
const rateLimit = new Map();

const cleanupRateLimit = () => {
    const now = Date.now();
    for (const [key, data] of rateLimit.entries()) {
        if (now - data.timestamp > 60000) { // Clean up after 1 minute
            rateLimit.delete(key);
        }
    }
};
setInterval(cleanupRateLimit, 60000);

// Helper to get real IP (more secure)
const getRealIp = (req) => {
    // Check Cloudflare's header first
    const cfIp = req.headers["cf-connecting-ip"];
    if (cfIp) return cfIp;

    // Check for load balancer forwarded IP
    const forwarded = req.headers["x-forwarded-for"];
    if (forwarded) {
        // Take the first IP, but validate it's not private
        const ips = forwarded.split(",");
        const publicIp = ips.find(ip =>
            ip && !ip.startsWith("10.") &&
            !ip.startsWith("192.168.") &&
            !ip.startsWith("172.") &&
            ip !== "127.0.0.1" &&
            ip !== "::1"
        );
        if (publicIp) return publicIp.trim();
    }

    // Fallback to remote address
    const remoteIp = req.socket.remoteAddress;
    // Remove IPv6 prefix if present
    return remoteIp?.replace(/^::ffff:/, "");
};

// Helper to check rate limit
const checkRateLimit = (identifier, limit = 10, windowMs = 60000) => {
    const now = Date.now();
    const key = `rate:${identifier}`;
    const data = rateLimit.get(key);

    if (!data) {
        rateLimit.set(key, { count: 1, timestamp: now });
        return true;
    }

    if (now - data.timestamp > windowMs) {
        rateLimit.set(key, { count: 1, timestamp: now });
        return true;
    }

    if (data.count >= limit) {
        return false;
    }

    data.count++;
    rateLimit.set(key, data);
    return true;
};

// Middleware to check generation limits
export const checkGenerationLimit = async (req, res, next) => {
    try {
        if (req.user) {
            // Check user subscription status here
            // Will implement with Stripe
            return next();
        }

        if (!req.guest) {
            return res.status(401).json({
                message: "Guest session not found"
            });
        }

        // Check if guest has used all free generations
        if (req.guest.generationsUsed >= req.guest.freeGenerations) {
            return res.status(403).json({
                message: "Free generations exhausted. Please sign up for an account.",
                generationsUsed: req.guest.generationsUsed,
                freeGenerations: req.guest.freeGenerations
            });
        }

        // Check rate limit for this guest
        const rateLimitOk = checkRateLimit(
            `guest:${req.guest.guestId}`,
            5, // 5 requests
            60000 // per minute
        );

        if (!rateLimitOk) {
            return res.status(429).json({
                message: "Too many requests. Please slow down."
            });
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error checking generation limits" });
    }
};

// Update generation usage
export const incrementGenerationUsage = async (req, res, next) => {
    try {
        if (req.user) {
            return next();
        }

        if (req.guest) {
            // Atomic increment with check - prevents going over limit
            const [updated] = await Guest.update(
                {
                    generationsUsed: req.guest.generationsUsed + 1
                },
                {
                    where: {
                        guestId: req.guest.guestId,
                        generationsUsed: req.guest.generationsUsed // Only update if not changed
                    }
                }
            );

            // If no rows updated, someone else already incremented
            if (updated === 0 && req.guest.generationsUsed + 1 > req.guest.freeGenerations) {
                return res.status(403).json({
                    message: "Generation limit exceeded"
                });
            }
        }

        next();
    } catch (err) {
        console.error(err);
        next(); // Don't block on tracking error
    }
};

export const guestMiddleware = async (req, res, next) => {
    try {
        // Check for authenticated user first
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
                // Invalid token, clear it
                res.clearCookie('token');
            }
        }

        const ip = getRealIp(req);

        // Create a browser fingerprint (basic version)
        const userAgent = req.headers['user-agent'] || '';
        const acceptLanguage = req.headers['accept-language'] || '';
        const fingerprint = crypto
            .createHash('md5')
            .update(`${ip}|${userAgent}|${acceptLanguage}`)
            .digest('hex');

        let guestId = req.cookies.guestId;
        let guest = null;

        // Try to find by guestId cookie first
        if (guestId) {
            guest = await Guest.findOne({ where: { guestId } });

            // Verify fingerprint matches to prevent cookie theft
            if (guest && guest.fingerprint !== fingerprint) {
                // Possible cookie theft, create new guest
                guest = null;
                guestId = null;
            }
        }

        // Try to find by IP + fingerprint combo
        if (!guest && ip) {
            guest = await Guest.findOne({
                where: {
                    ipAddress: ip,
                    fingerprint: fingerprint
                }
            });
            if (guest) {
                guestId = guest.guestId;
            }
        }

        // Create new guest if none found
        if (!guest) {
            guestId = uuidv4();
            guest = await Guest.create({
                guestId,
                ipAddress: ip,
                fingerprint: fingerprint,
                generationsUsed: 0,
                freeGenerations: parseInt(process.env.GUEST_FREE_GENERATIONS) || 15,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });

            // Set cookies with security flags
            res.cookie("guestId", guestId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });
        }

        req.guest = guest;
        next();
    } catch (err) {
        console.error("Guest middleware error:", err);
        res.status(500).json({ message: "Guest tracking error" });
    }
};