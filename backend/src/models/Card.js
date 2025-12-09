import {DataTypes} from "sequelize";
import {sequelize} from "../config/db.js";

const Card = sequelize.define("Card", {
    front: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    back: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

export default Card;