import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderItems: Array,
  shippingAddress: {
    address: String,
    city: String,
    postalCode: String,
  },
  totalPrice: Number,
  paymentMethod: {
    type: String,
    default: "Cash on Delivery",
    enum: ["Cash on Delivery", "Razorpay", "Stripe", "PayPal"],
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
  },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
