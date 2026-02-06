import {DataTypes} from "sequelize";
import {sequelize} from "../config/db.js";
import Card from "./Card.js";

const Deck = sequelize.define("Deck", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    tags: {
        type: DataTypes.JSON,
        defaultValue: [],
        allowNull: false
    },
    deckHash: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: ""
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

Deck.hasMany(Card, { foreignKey: "deckId", onDelete: "CASCADE" });
Card.belongsTo(Deck, { foreignKey: "deckId" });

export default Deck;