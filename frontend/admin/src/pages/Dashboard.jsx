import {
  FaBook,
  FaShoppingCart,
  FaUsers,
  FaRupeeSign
} from "react-icons/fa";

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";

import { useEffect, useState } from "react";
import API from "../api/axios";
// import "./admin.css";

export default function Dashboard() {

  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  

  const fetchData = async () => {
    try {
      const [booksRes, ordersRes, usersRes] = await Promise.all([
        API.get("/books"),
        API.get("/orders"),
        API.get("/users"),
      ]);

      const books = booksRes.data;
      const orders = ordersRes.data;
      const users = usersRes.data;

      const total = orders.reduce((acc, o) => acc + o.totalPrice, 0);
      const revenue = total.toFixed(2);
      const orderStatus = {
        Pending: orders.filter(o => o.status === "Pending").length,
        Shipped: orders.filter(o => o.status === "Shipped").length,
        Delivered: orders.filter(o => o.status === "Delivered").length,
      };  

      setStats({
        books: books.length,
        users: users.length,
        orders: orders.length,
        revenue,
        orderStatus,
      });

      // 📦 latest 5 orders
      setRecentOrders(
        orders.slice(-5).reverse()
      );

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <h3>Loading dashboard...</h3>
        </div>
      </div>
    );
  }

  const pieData = Object.entries(stats.orderStatus).map(
    ([name, value]) => ({ name, value })
  );

  const barData = [
    { name: "Books", value: stats.books },
    { name: "Users", value: stats.users },
    { name: "Orders", value: stats.orders },
  ];

  const COLORS = ["#f59e0b", "#3b82f6", "#10b981"];

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-main-title">📊 Admin Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back! Here's your store overview</p>
        </div>
        <div className="header-date">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* 🔢 STAT CARDS */}
      <div className="stat-cards-container">
        <Card icon={<FaBook />} title="Books" value={stats.books} color="books" />
        <Card icon={<FaUsers />} title="Users" value={stats.users} color="users" />
        <Card icon={<FaShoppingCart />} title="Orders" value={stats.orders} color="orders" />
        <Card icon={<FaRupeeSign />} title="Revenue" value={`₹${stats.revenue}`} color="revenue" />
      </div>

      {/* 📊 CHARTS SECTION */}     
      <div className="charts-section">
        <h2 className="section-title">Analytics Overview</h2>
        <div className="charts-container">

        {/* 🥧 PIE CHART */}
        <div className="chart-box">
          <h3 className="chart-title">📈 Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100} label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 📊 BAR CHART */}
        <div className="chart-box">
          <h3 className="chart-title">📊 Store Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  background: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }} 
              />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    {/* 📦 RECENT ORDERS SECTION */}
    <div className="recent-orders-section">
      <div className="section-header">
        <h2 className="section-title">Recent Orders</h2>
        <span className="order-count">Latest 5 orders</span>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Order Date</th>
              <th>orderItems</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {recentOrders.map(o => (
              <tr key={o._id}>
                <td>{o.user?.name}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>
                  {o.orderItems.map((item, i) => (
                    <div key={i} className="order-item">
                      {item.title} × {item.qty} — ₹{item.price}
                    </div>
                  ))}
                </td>
                <td>₹{o.totalPrice}</td>
                <td>
                  <span className={`status ${o.status.toLowerCase()}`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>

    </div>
  );
}

function Card({ icon, title, value, color }) {
  return (
    <div className={`card ${color}`}>
      <div className="card-icon">{icon}</div>
      <div>
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
}


