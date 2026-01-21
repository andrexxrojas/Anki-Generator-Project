import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Guest from "../models/Guest.js";
import {Op} from "sequelize";
import Deck from "../models/Deck.js";

// Register a user
export const register = async (req, res) => {
    const { username, email, password } = req.body;
    const transaction = await User.sequelize.transaction();

    try {
        const existing = await User.findOne({ where: { email }, transaction });
        if (existing) {
            await transaction.rollback();
            return res.status(400).json({ error: "Email already in use." });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create(
            { username, email, password: hashed },
            { transaction }
        );

        const shouldMigrateDeck =
            req.guest && req.cookies?.pendingDeckMigration === "1";

        if (shouldMigrateDeck) {
            await Deck.update(
                {
                    ownerType: "user",
                    ownerId: String(user.id),
                },
                {
                    where: {
                        ownerType: "guest",
                        ownerId: String(req.guest.id)
                    },
                    transaction
                }
            );

            await Guest.destroy({
                where: { id: req.guest.id },
                transaction
            });

            res.clearCookie("guestId");
            res.clearCookie("pendingDeckMigration");
        }

        await transaction.commit();

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });

        res.json({
            message: "User created",
            userId: user.id,
            migratedDeck: shouldMigrateDeck
        });

    } catch (err) {
        await transaction.rollback();
        res.status(500).json({ error: err.message });
    }
};


// Log in a user
export const login = async (req, res) => {
    const {identifier, password} = req.body;

    try {
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    {email: identifier},
                    {username: identifier}
                ]
            }
        })

        if (!user) {
            return res.status(404).json({error: "User not found."});
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({error: "Invalid credentials."});

        const token = jwt.sign(
            {id: user.id},
            process.env.JWT_SECRET,
            {expiresIn: "24h"}
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000
        })

        res.json({message: "Logged in user with token:", token});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

// Log out a user
export const logout = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0)
    });

    res.json({message: "User logged out successfully"});
}

// Check if user is logged in
export const me = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) return res.status(401).json({error: "Token not found"});

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id, {
            attributes: ['id', 'email', "username"],
        });

        if (!user) return res.status(401).json({error: "User not found"});

        res.json({ user });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}