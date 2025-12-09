import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {Op} from "sequelize";

// Register a user
export const register = async (req, res) => {
    const {username, email, password} = req.body;

    try {
        const existing = await User.findOne({where: {email}});
        if (existing) return res.status(400).json({error: "Email already in use."});

        // Hash password
        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({username, email, password: hashed});

        res.json({message: "User created:", userId: user.id});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

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