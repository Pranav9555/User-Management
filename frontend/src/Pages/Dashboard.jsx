import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import { getApiError, getStats, getUsers } from "../services/userService";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [statsData, userData] = await Promise.all([getStats(), getUsers()]);
      setStats({
        total: statsData.total ?? 0,
        active: statsData.active ?? 0,
        inactive: statsData.inactive ?? 0,
      });
      const users = userData.users || [];
      setRecent(
        [...users]
          .sort(
            (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
          )
          .slice(0, 5),
      );
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Dashboard overview</h1>
          <p className="page-description">
            A quick view of your team and workspace.
          </p>
        </div>
        <button className="button button-secondary" onClick={loadDashboard}>
          ↻ Refresh
        </button>
      </div>
      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}
      <section className="stats-grid">
        <StatCard
          title="Total users"
          value={loading ? "—" : stats.total}
          note="All registered members"
          icon="♙"
        />
        <StatCard
          title="Active users"
          value={loading ? "—" : stats.active}
          note="Currently active"
          icon="✓"
        />
        <StatCard
          title="Inactive users"
          value={loading ? "—" : stats.inactive}
          note="Currently inactive"
          icon="◷"
        />
      </section>
      <section className="panel recent-panel">
        <div className="panel-heading">
          <div>
            <h2>Recently joined</h2>
          </div>
          <Link to="/users" className="button button-primary">
            Manage users
          </Link>
        </div>
        {loading ? (
          <div className="empty-state">Loading dashboard data…</div>
        ) : recent.length === 0 ? (
          <div className="empty-state">
            <h3>No users yet</h3>
            <p>Add your first team member to get started.</p>
            <Link className="button button-primary" to="/users">
              Add a user
            </Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>USER</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>JOINED</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-cell">
                        <span className="user-avatar">
                          {user.name?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                        <span>
                          <strong>{user.name}</strong>
                          <small>{user.email}</small>
                        </span>
                      </div>
                    </td>
                    <td>{user.role || "User"}</td>
                    <td>
                      <span
                        className={`status-pill ${user.status === "Active" ? "status-active" : "status-inactive"}`}
                      >
                        {user.status || "Unknown"}
                      </span>
                    </td>
                    <td>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
