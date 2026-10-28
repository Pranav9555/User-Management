import { useCallback, useEffect, useMemo, useState } from "react";
import UserModal from "../components/UserModal";
import {
  createUser,
  deleteUser,
  getApiError,
  getUsers,
  updateUser,
} from "../services/userService";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("edit");
  const [saving, setSaving] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getUsers();
      setUsers(result.users || []);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const visibleUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter(
      (user) =>
        [user.name, user.email, user.role, user.phone].some((value) =>
          value?.toLowerCase().includes(term),
        ) &&
        (filter === "All" || user.status === filter),
    );
  }, [users, search, filter]);

  function openAdd() {
    setSelected(null);
    setModalMode("edit");
    setModalOpen(true);
    setError("");
    setNotice("");
  }
  function openUser(user, mode) {
    setSelected(user);
    setModalMode(mode);
    setModalOpen(true);
    setError("");
  }

  async function saveUser(payload) {
    setSaving(true);
    setError("");
    try {
      if (selected?._id) {
        await updateUser(selected._id, payload);
        setNotice("User updated successfully.");
      } else {
        await createUser(payload);
        setNotice("User created successfully.");
      }
      setModalOpen(false);
      setSelected(null);
      await loadUsers();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSaving(false);
    }
  }

  async function removeUser(user) {
    if (
      !window.confirm(
        `Are you sure you want to delete ${user.name}? This cannot be undone.`,
      )
    )
      return;
    setError("");
    setNotice("");
    try {
      await deleteUser(user._id);
      setNotice("User deleted successfully.");
      await loadUsers();
    } catch (err) {
      setError(getApiError(err));
    }
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>User management</h1>
          <p className="page-description">
            Create, view, update, and remove team members.
          </p>
        </div>
        <button className="button button-primary" onClick={openAdd}>
          ＋ Add user
        </button>
      </div>
      {notice && (
        <div className="alert alert-success" role="status">
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss message">
            ×
          </button>
        </div>
      )}
      {error && (
        <div className="alert alert-error" role="alert">
          {error}
          <button onClick={() => setError("")} aria-label="Dismiss error">
            ×
          </button>
        </div>
      )}
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Team members</h2>
            <p>Users are loaded from your Express API and stored in MongoDB.</p>
          </div>
          <span className="count-chip">{visibleUsers.length} members</span>
        </div>
        <div className="toolbar">
          <input
            className="search-input"
            type="search"
            placeholder="Search name, email, role, or phone…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search users"
          />
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <button className="button button-secondary" onClick={loadUsers}>
            ↻ Refresh
          </button>
        </div>
        {loading ? (
          <div className="empty-state">Loading users…</div>
        ) : visibleUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">♙</div>
            <h3>{users.length ? "No matching users" : "No users yet"}</h3>
            <p>
              {users.length
                ? "Try changing your search or filter."
                : "Add your first user to get started."}
            </p>
            {users.length === 0 && (
              <button className="button button-primary" onClick={openAdd}>
                ＋ Add first user
              </button>
            )}
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>USER</th>
                  <th>ROLE</th>
                  <th>PHONE</th>
                  <th>STATUS</th>
                  <th>JOINED</th>
                  <th className="actions-heading">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {visibleUsers.map((user) => (
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
                    <td>
                      <span className="role-chip">{user.role || "User"}</span>
                    </td>
                    <td>{user.phone || "—"}</td>
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
                    <td>
                      <div className="row-actions">
                        <button
                          className="button button-small button-secondary"
                          onClick={() => openUser(user, "view")}
                        >
                          View
                        </button>
                        <button
                          className="button button-small button-secondary"
                          onClick={() => openUser(user, "edit")}
                        >
                          Edit
                        </button>
                        <button
                          className="button button-small button-danger"
                          onClick={() => removeUser(user)}
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
        <div className="panel-footer">
          Showing {visibleUsers.length} of {users.length} users
        </div>
      </section>
      {modalOpen && (
        <UserModal
          user={selected}
          mode={modalMode}
          busy={saving}
          serverError={error}
          onClose={() => {
            setModalOpen(false);
            setSelected(null);
          }}
          onSave={saveUser}
        />
      )}
    </>
  );
}
