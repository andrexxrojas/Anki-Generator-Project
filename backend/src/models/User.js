import {DataTypes} from "sequelize";
import {sequelize} from "../config/db.js";
import Deck from "./Deck.js";

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Removed generationsUsed - using monthlyGenerationsUsed instead
    subscriptionTier: {
        type: DataTypes.ENUM('free', 'pro', 'premium'),
        defaultValue: 'free'
    },
    monthlyGenerationLimit: {
        type: DataTypes.INTEGER,
        defaultValue: 15  // Free tier gets 15 per month
    },
    monthlyGenerationsUsed: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    lastResetDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    stripeCustomerId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    stripeSubscriptionId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    subscriptionStatus: {
        type: DataTypes.ENUM('active', 'past_due', 'canceled', 'incomplete', 'inactive'),
        defaultValue: 'inactive'
    }
});

export default User;