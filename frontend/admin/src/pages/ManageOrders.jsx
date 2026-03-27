import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "../utils/toast";
import "./admin.css";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const openOrder = (order) => {
    setSelectedOrder(order);
  };

  const closeOrder = () => {
    setSelectedOrder(null);
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
                  <th>Payment</th>
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
                      <span className="payment-badge">
                        {order.paymentMethod || "Cash on Delivery"}
                      </span>
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
                          className="view-btn"
                          onClick={() => openOrder(order)}
                          title="View Order"
                        >
                          View
                        </button>
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

      {selectedOrder && (
        <div className="order-modal-backdrop" onClick={closeOrder}>
          <div
            className="order-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="order-modal-header">
              <div>
                <h2>Order Details</h2>
                <p className="order-modal-subtitle">
                  Order ID: {selectedOrder._id}
                </p>
              </div>
              <button className="modal-close-btn" onClick={closeOrder}>
                Close
              </button>
            </div>

            <div className="order-modal-body">
              <div className="order-detail-grid">
                <div className="detail-card">
                  <h4>Customer</h4>
                  <p className="detail-main">{selectedOrder.user?.name || "N/A"}</p>
                  <p className="detail-sub">{selectedOrder.user?.email || "N/A"}</p>
                </div>
                <div className="detail-card">
                  <h4>Status</h4>
                  <span
                    className={`status-badge ${selectedOrder.status.toLowerCase()}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="detail-card">
                  <h4>Payment</h4>
                  <p className="detail-main">
                    {selectedOrder.paymentMethod || "Cash on Delivery"}
                  </p>
                </div>
                <div className="detail-card">
                  <h4>Order Date</h4>
                  <p className="detail-main">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="order-items-section">
                <div className="order-items-header">
                  <h3>Items</h3>
                  <span className="items-count">
                    {selectedOrder.orderItems.length} items
                  </span>
                </div>
                <div className="order-items-list">
                  {selectedOrder.orderItems.map((item, idx) => (
                    <div className="order-item-row" key={`${item._id || item.title}-${idx}`}>
                      <div className="order-item-info">
                        <p className="order-item-title">{item.title}</p>
                        <p className="order-item-meta">
                          Qty: {item.qty} • Price: Rs. {item.price}
                        </p>
                      </div>
                      <div className="order-item-total">
                        Rs. {(item.price * item.qty).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-total-section">
                <div className="order-total-row">
                  <span>Total Payable</span>
                  <strong>Rs. {selectedOrder.totalPrice.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
