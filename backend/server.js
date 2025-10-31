import "dotenv/config";
import express from "express";
import cors from "cors";
import { config } from "./src/config/index.js";
import authRoutes from "./src/routes/auth.js";
import deviceRoutes from "./src/routes/devices.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api", authRoutes);
app.use("/api", deviceRoutes);

app.listen(config.port, () => {
  console.log(`dexmon backend running on port ${config.port}`);
});
