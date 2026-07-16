import express from "express";
import {
  createOrder,
  confirmPayment,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

// TEMPORARY - NO AUTH for testing
orderRouter.post("/", createOrder); // Removed authMiddleware temporarily

// Keep auth on other endpoints
orderRouter.post("/confirm", authMiddleware, confirmPayment);
orderRouter.put("/:id", authMiddleware, updateOrder);
orderRouter.delete("/:id", authMiddleware, deleteOrder);

// Public endpoints
orderRouter.get("/", getOrders);
orderRouter.get("/:id", getOrderById);

export default orderRouter;