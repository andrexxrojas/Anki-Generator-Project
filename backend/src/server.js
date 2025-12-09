import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import syncDb from "./config/sync.js";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/authRoutes.js";
import generateRoutes from "./routes/generateRoutes.js";
import deckRoutes from "./routes/deckRoutes.js";
import validateRoutes from "./routes/validateRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/openai", generateRoutes);
app.use("/api/deck", deckRoutes);
app.use("/api/file", validateRoutes);
app.use('/api/file-export', exportRoutes);

// Sync database and start the server
syncDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Failed to sync DB:", err);
    })

