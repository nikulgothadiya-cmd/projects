import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "../utils/toast";
import "./admin.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  

  // ✅ FETCH USERS
  const getUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Unauthorized");
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // ✅ DELETE USER
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?"))
      return;

    try {
      await API.delete(`/users/${id}`);

      toast.success("User deleted successfully");

      getUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  // Filter and search logic
  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === "All" || 
      (filterRole === "Admin" ? user.isAdmin : !user.isAdmin);
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Calculate stats
  const stats = {
    total: users.length,
    admins: users.filter(u => u.isAdmin).length,
    regularUsers: users.filter(u => !u.isAdmin).length
  };

  if (loading) {
    return (
      <div className="manage-users">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3>Loading users...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-users">
      {/* Header Section */}
      <div className="users-header">
        <div className="header-content">
          <h1 className="users-title">👥 User Management</h1>
          <p className="users-subtitle">Manage user accounts and permissions</p>
        </div>
        <div className="users-stats">
          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-info">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Users</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👨‍💼</div>
            <div className="stat-info">
              <span className="stat-number">{stats.admins}</span>
              <span className="stat-label">Admins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="users-filter-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-tabs">
          {["All", "Admin", "User"].map(role => (
            <button
              key={role}
              className={`filter-tab ${filterRole === role ? 'active' : ''}`}
              onClick={() => setFilterRole(role)}
            >
              {role}
              <span className="filter-count">
                {role === "All" ? stats.total :
                 role === "Admin" ? stats.admins : stats.regularUsers}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Users Table Section */}
      <div className="users-table-container">
        <div className="table-header">
          <h3>Users ({filteredUsers.length})</h3>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No users found</h3>
            <p>No users match your search or filter criteria.</p>
          </div>
        ) : (
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u, i) => (
                  <tr key={u._id} className="user-row">
                    <td>
                      <span className="user-index">{i + 1}</span>
                    </td>
                    <td>
                      <div className="user-name-cell">
                        <div className="user-avatar">{u.name.charAt(0).toUpperCase()}</div>
                        <div className="user-name">{u.name}</div>
                      </div>
                    </td>
                    <td>
                      <div className="user-email">{u.email}</div>
                    </td>
                    <td>
                      <span
                        className={`role-badge ${u.isAdmin ? "role-admin" : "role-user"}`}
                      >
                        {u.isAdmin ? "👨‍💼 Admin" : "👤 User"}
                      </span>
                    </td>
                    <td>
                      <div className="join-date">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {!u.isAdmin && (
                          <button
                            className="delete-btn"
                            onClick={() => deleteUser(u._id)}
                            title="Delete User"
                          >
                            🗑️
                          </button>
                        )}
                        {u.isAdmin && (
                          <span className="admin-badge">Protected</span>
                        )}
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



