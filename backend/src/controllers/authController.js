import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Guest from "../models/Guest.js";
import {Op} from "sequelize";
import stripe from "../config/stripe.js";
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

        // Get guestId from cookies
        const guestId = req.cookies.guestId;
        let guest = null;
        let monthlyGenerationsUsed = 0;
        let monthlyGenerationLimit = 15; // Default for new users (15 per month)

        // Find guest if exists
        if (guestId) {
            guest = await Guest.findOne({ where: { guestId }, transaction });
            if (guest) {
                // Transfer their generation usage to monthly usage
                monthlyGenerationsUsed = guest.generationsUsed;
                monthlyGenerationLimit = 15; // Same limit as guests
            }
        }

        // Create user with transferred generation data
        const user = await User.create(
            {
                username,
                email,
                password: hashed,
                monthlyGenerationsUsed: monthlyGenerationsUsed,  // Preserve their usage
                monthlyGenerationLimit: monthlyGenerationLimit,  // 15 per month
                subscriptionTier: 'free',
                subscriptionStatus: 'inactive',
                lastResetDate: new Date()
            },
            { transaction }
        );

        const shouldMigrateDeck =
            guest && req.cookies?.pendingDeckMigration === "1";

        if (shouldMigrateDeck) {
            await Deck.update(
                {
                    ownerType: "user",
                    ownerId: String(user.id),
                },
                {
                    where: {
                        ownerType: "guest",
                        ownerId: String(guest.id)
                    },
                    transaction
                }
            );
        }

        // Delete the guest account after transferring data
        if (guest) {
            await Guest.destroy({
                where: { id: guest.id },
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
            migratedDeck: shouldMigrateDeck,
            generationsTransferred: monthlyGenerationsUsed,
            monthlyLimit: monthlyGenerationLimit
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
            sameSite: "lax",
            maxAge: 60 * 60 * 1000
        })

        res.clearCookie("guestId");
        res.clearCookie("pendingDeckMigration");

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
        sameSite: "lax",
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

export const deleteAccount = async (req, res) => {
    try {
        const user = req.user;

        console.log(`Attempting to delete account for user: ${user.email}`);

        // Check if user has an active subscription
        if (user.stripeSubscriptionId && user.subscriptionStatus === 'active') {
            console.log(`Cancelling Stripe subscription: ${user.stripeSubscriptionId}`);
            try {
                await stripe.subscriptions.update(user.stripeSubscriptionId, {
                    cancel_at_period_end: true
                });
            } catch (stripeError) {
                console.error('Stripe cancellation error:', stripeError.message);
            }
        }

        // Delete user's decks - use ownerType and ownerId
        await Deck.destroy({
            where: {
                ownerType: 'user',
                ownerId: user.id.toString()  // ownerId is a string
            }
        });

        // Delete the user
        await user.destroy();

        // Clear cookies
        res.clearCookie('token');

        console.log(`Account deleted successfully for: ${user.email}`);
        res.json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error('Error in deleteAccount:', error);
        res.status(500).json({ message: "Error deleting account", error: error.message });
    }
};

// Get user profile information
export const getProfile = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        // Check and reset monthly limit if needed
        const now = new Date();
        const lastReset = new Date(user.lastResetDate);

        if (now.getMonth() !== lastReset.getMonth() ||
            now.getFullYear() !== lastReset.getFullYear()) {
            user.monthlyGenerationsUsed = 0;
            user.lastResetDate = now;
            await user.save();
        }

        // Get generations left this month
        const generationsLeft = Math.max(0, user.monthlyGenerationLimit - user.monthlyGenerationsUsed);

        // Fetch next billing date if user has active subscription
        let nextBillingDate = null;
        let nextBillingDateFormatted = null;

        if (user.stripeSubscriptionId && user.subscriptionStatus === 'active') {
            try {
                const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);

                if (subscription.items && subscription.items.data && subscription.items.data.length > 0) {
                    const timestamp = subscription.items.data[0].current_period_end;
                    nextBillingDate = timestamp;
                    // Create formatted date
                    nextBillingDateFormatted = new Date(timestamp * 1000).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                }
            } catch (stripeError) {
                console.error('Error fetching subscription from Stripe:', stripeError.message);
            }
        }

        res.json({
            username: user.username,
            email: user.email,
            totalDecksGenerated: user.totalDecksGenerated,
            monthlyDecksGenerated: user.monthlyGenerationsUsed,
            generationsLeft: generationsLeft,
            monthlyLimit: user.monthlyGenerationLimit,
            subscriptionTier: user.subscriptionTier,
            subscriptionStatus: user.subscriptionStatus,
            nextBillingDate: nextBillingDateFormatted,
            pendingDowngradeTier: user.pendingDowngradeTier,
            pendingDowngradeDate: user.pendingDowngradeDate
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};