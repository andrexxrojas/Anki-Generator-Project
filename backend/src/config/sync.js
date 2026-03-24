import {sequelize} from "./db.js";
import User from "../models/User.js";
import Deck from "../models/Deck.js";
import Card from "../models/Card.js";

const syncDb = async () => {
    try {
        await sequelize.sync();
        console.log("All models were synchronized successfully");
    } catch (err) {
        console.error(err);
    }
}

export default syncDb;