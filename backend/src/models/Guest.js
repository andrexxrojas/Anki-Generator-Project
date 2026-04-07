import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Guest = sequelize.define("Guest", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    guestId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fingerprint: {
        type: DataTypes.STRING,
        allowNull: true
    },
    generationsUsed: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    freeGenerations: {
        type: DataTypes.INTEGER,
        defaultValue: 4
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
}, {
    timestamps: true,
    indexes: [
        { fields: ['ipAddress', 'fingerprint'] },
        { fields: ['expiresAt'] }
    ]
});

export default Guest;