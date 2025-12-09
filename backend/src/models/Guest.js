import {DataTypes} from "sequelize";
import {sequelize} from "../config/db.js";

const Guest = sequelize.define("Guest", {
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
});


export default Guest;