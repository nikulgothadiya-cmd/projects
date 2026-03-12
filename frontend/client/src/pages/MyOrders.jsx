import "./pages.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "../utils/toast";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    const { data } = await axios.get("/api/orders/my");
    const sortedOrders = [...data].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setOrders(sortedOrders);
  };

  const cancelOrder = async (id, status) => {
    if (status.toLowerCase() !== "pending") {
      toast.warn("Only pending orders can be cancelled");
      return;
    }

    if (!confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      await axios.put(`/api/orders/my/${id}/cancel`);
      toast.success("Order cancelled successfully");
      getOrders();
    } catch (error) {
      toast.error("Failed to cancel order: " + (error.response?.data?.msg || error.message));
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="orders-container">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <h3>No Orders Yet</h3>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-header">
              <p>Order ID: {order._id}</p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <span className={`status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>

            <hr />

            {order.orderItems.map((item, i) => (
              <div key={i} className="order-item">
                <span>{item.title} x {item.qty}</span>
                <span>Rs. {item.price * item.qty}</span>
              </div>
            ))}

            <hr />

            <div className="order-header">
              <h4>Total: Rs. {order.totalPrice}</h4>
              {order.status.toLowerCase() === "pending" && (
                <button
                  className="ordercanel"
                  onClick={() => cancelOrder(order._id, order.status)}
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
