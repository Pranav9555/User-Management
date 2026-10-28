import { useEffect, useState } from "react";

const initialForm = {
  name: "",
  email: "",
  role: "Developer",
  phone: "",
  status: "Active",
};

export default function UserModal({
  user,
  mode = "edit",
  onClose,
  onSave,
  busy = false,
  serverError = "",
}) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const readOnly = mode === "view";

  useEffect(() => {
    setForm(
      user
        ? {
            name: user.name || "",
            email: user.email || "",
            role: user.role || "User",
            phone: user.phone || "",
            status: user.status || "Active",
          }
        : initialForm,
    );
    setError("");
  }, [user]);

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    if (readOnly) return onClose();
    if (form.name.trim().length < 2)
      return setError("Name must contain at least 2 characters.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      return setError("Enter a valid email address.");
    setError("");
    await onSave({
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
    });
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-modal-title"
      >
        <div className="modal-heading">
          <div>
            <h2 id="user-modal-title">
              {readOnly ? "User details" : user ? "Edit user" : "Add new user"}
            </h2>
            <p>
              {readOnly
                ? "Review this member's information."
                : "Fields marked with * are required."}
            </p>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>
        {(error || serverError) && (
          <div className="alert alert-error" role="alert">
            {error || serverError}
          </div>
        )}
        <form onSubmit={submit} className="user-form">
          <label>
            Full name *
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              required
              minLength={2}
              maxLength={100}
              disabled={readOnly}
              placeholder="e.g. Priya Sharma"
            />
          </label>
          <label>
            Email address *
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              required
              disabled={readOnly}
              placeholder="priya@example.com"
            />
          </label>
          <div className="form-grid">
            <label>
              Role
              <select
                name="role"
                value={form.role}
                onChange={updateField}
                disabled={readOnly}
              >
                {["Admin", "Developer", "Designer", "Manager", "User"].map(
                  (role) => (
                    <option key={role}>{role}</option>
                  ),
                )}
              </select>
            </label>
            <label>
              Status
              <select
                name="status"
                value={form.status}
                onChange={updateField}
                disabled={readOnly}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </label>
          </div>
          <label>
            Phone number
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={updateField}
              maxLength={30}
              disabled={readOnly}
              placeholder="Optional"
            />
          </label>
          {user?.createdAt && (
            <p className="detail-meta">
              Joined {new Date(user.createdAt).toLocaleString()}
            </p>
          )}
          <div className="modal-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={onClose}
            >
              {readOnly ? "Close" : "Cancel"}
            </button>
            {!readOnly && (
              <button
                className="button button-primary"
                type="submit"
                disabled={busy}
              >
                {busy ? "Saving…" : user ? "Save changes" : "Create user"}
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
