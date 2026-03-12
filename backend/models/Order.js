import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderItems: Array,
  totalPrice: Number,
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
  },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
