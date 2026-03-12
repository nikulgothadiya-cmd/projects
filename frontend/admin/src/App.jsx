import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import ManageBooks from "./pages/ManageBooks";
import ManageOrders from "./pages/ManageOrders";
import ManageUsers from "./pages/ManageUsers";
import AdminLogin from "./pages/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import "./pages/admin.css";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<ManageBooks />} />
          <Route path="/orders" element={<ManageOrders />} />
          <Route path="/users" element={<ManageUsers />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔐 ADMIN LOGIN */}
        <Route path="/login" element={<AdminLogin />} />

        {/* 🔒 PROTECTED ADMIN PANEL */}
        <Route
          path="/*"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
