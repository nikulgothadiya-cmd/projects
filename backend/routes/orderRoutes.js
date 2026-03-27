import express from "express";
import Order from "../models/Order.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    res.json(await Order.create({ ...req.body, user: req.user.id }));
  } catch (error) {
    res.status(500).json({ msg: error.message || "Failed to create order" });
  }
});

router.get("/my", protect, async (req, res) => {
  try {
    res.json(await Order.find({ user: req.user.id }));
  } catch (error) {
    res.status(500).json({ msg: error.message || "Failed to fetch orders" });
  }
});

router.put("/my/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    if (order.status.toLowerCase() !== "pending") {
      return res.status(400).json({ msg: "Only pending orders can be cancelled" });
    }

    order.status = "Cancelled";
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ msg: error.message || "Failed to cancel order" });
  }
});

router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ msg: error.message || "Failed to fetch all orders" });
  }
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { returnDocument: "after", runValidators: true }
    );

    res.json(order);
  } catch (error) {
    res.status(500).json({ msg: error.message || "Failed to update order status" });
  }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ msg: "Order deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message || "Failed to delete order" });
  }
});

export default router;
