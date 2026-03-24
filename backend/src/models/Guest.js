import {DataTypes} from "sequelize";
import {sequelize} from "../config/db.js";

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
    generationsUsed: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    freeGenerations: {
        type: DataTypes.INTEGER,
        defaultValue: 15
    }
}, { timestamps: true });


export default Guest;