import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import userRouter from "./routes/userRoute.js";
import itemRouter from "./routes/productRoute.js";
import authMiddleware from "./middleware/auth.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
const PORT = process.env.PORT || 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:8000"
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "API working" });
});

app.use("/api/user", userRouter);
app.use("/api/items", itemRouter);
app.use("/api/cart", authMiddleware, cartRouter);
app.use("/api/orders", orderRouter);


(async () => {

  let dbConnected = false;

  try {

    console.log("Mongo URI:", process.env.MONGO_URI);

    const result = await connectDB();

    dbConnected = result === true;

  } catch (error) {

    console.log("DB error:", error.message);

  }


  app.listen(PORT, () => {

    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔌 DB connected: ${dbConnected}`);

  });

})();