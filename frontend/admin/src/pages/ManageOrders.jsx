import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "../utils/toast";
import "./admin.css";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const getOrders = async () => {
    try {
      const res = await API.get("/orders");
      const sortedOrders = [...res.data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      await API.put(`/orders/${id}`, { status });
      getOrders();
    } catch (err) {
      console.log(err);
      toast.error("Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await API.delete(`/orders/${id}`);
      getOrders();
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  const filteredOrders = orders.filter(
    (order) => filterStatus === "All" || order.status === filterStatus
  );

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    shipped: orders.filter((o) => o.status === "Shipped").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    totalRevenue: orders.reduce((sum, o) => sum + o.totalPrice, 0),
  };

  if (loading) {
    return (
      <div className="manage-orders">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3>Loading orders...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-orders">
      <div className="orders-header">
        <div className="header-content">
          <h1 className="orders-title">Order Management</h1>
          <p className="orders-subtitle">Monitor and manage all customer orders</p>
        </div>
        <div className="orders-stats">
          <div className="stat-card">
            <div className="stat-icon">#</div>
            <div className="stat-info">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Orders</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">Rs</div>
            <div className="stat-info">
              <span className="stat-number">Rs. {stats.totalRevenue.toLocaleString()}</span>
              <span className="stat-label">Total Revenue</span>
            </div>
          </div>
        </div>
      </div>

      <div className="orders-filter">
        <div className="filter-tabs">
          {["All", "Pending", "Shipped", "Delivered"].map((status) => (
            <button
              key={status}
              className={`filter-tab ${filterStatus === status ? "active" : ""}`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
              {status !== "All" && (
                <span className="filter-count">
                  {status === "Pending"
                    ? stats.pending
                    : status === "Shipped"
                    ? stats.shipped
                    : stats.delivered}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="orders-table-container">
        <div className="table-header">
          <h3>Orders ({filteredOrders.length})</h3>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">-</div>
            <h3>No orders found</h3>
            <p>No orders match the selected filter.</p>
          </div>
        ) : (
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="order-row">
                    <td>
                      <div className="customer-info">
                        <div className="customer-name">{order.user?.name}</div>
                        <div className="customer-id">ID: {order._id.slice(-6)}</div>
                      </div>
                    </td>
                    <td>
                      <div className="customer-contact">
                        <div className="customer-email">{order.user?.email}</div>
                      </div>
                    </td>
                    <td>
                      <div className="order-items-preview">
                        {order.orderItems.slice(0, 2).map((item, i) => (
                          <div key={i} className="item-preview">
                            <span className="item-title">{item.title}</span>
                            <span className="item-qty">x{item.qty}</span>
                          </div>
                        ))}
                        {order.orderItems.length > 2 && (
                          <div className="more-items">+{order.orderItems.length - 2} more</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="order-total">Rs. {order.totalPrice.toLocaleString()}</div>
                    </td>
                    <td>
                      <div className="order-date">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td>
                      <div className="status-container">
                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                        <select
                          className="status-select"
                          value={order.status}
                          disabled={updatingId === order._id}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="delete-btn"
                          onClick={() => deleteOrder(order._id)}
                          title="Delete Order"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
