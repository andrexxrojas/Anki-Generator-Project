import {DataTypes} from "sequelize";
import {sequelize} from "../config/db.js";
import Card from "./Card.js";

const Deck = sequelize.define("Deck", {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    ownerType: {
        type: DataTypes.ENUM("guest", "user"),
        allowNull: false
    },
    ownerId: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Associations
Deck.hasMany(Card, {foreignKey: "deckId"});
Card.belongsTo(Deck, {foreignKey: "deckId"});

export default Deck;