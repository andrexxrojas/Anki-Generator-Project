import {DataTypes} from "sequelize";
import {sequelize} from "../config/db.js";
import Deck from "./Deck.js";

const User = sequelize.define("User", {
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
    }
})

// Associations
User.hasMany(Deck, {foreignKey: "userId"});
Deck.belongsTo(User, {foreignKey: "userId"});

export default User;
