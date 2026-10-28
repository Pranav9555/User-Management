import { NavLink, Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function AppLayout() {
  const { theme } = useTheme();
  const links = [
    { to: "/dashboard", label: "Dashboard", icon: "▦" },
    { to: "/users", label: "User management", icon: "♙" },
    { to: "/theme", label: "Theme studio", icon: "◐" },
  ];
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/dashboard" className="brand">
          <span className="brand-mark">U</span>
          <span>
            <strong>User Management</strong>
            <small> workspace</small>
          </span>
        </NavLink>
        <p className="nav-label">WORKSPACE</p>
        <nav className="main-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              <span className="nav-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="main-area">
        <header className="mobile-header">
          <NavLink to="/dashboard" className="brand">
            <span className="brand-mark">U</span>
            <strong>UserFlow</strong>
          </NavLink>
          <nav className="mobile-nav">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} title={link.label}>
                {link.icon}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
        <footer className="app-footer">
          © {new Date().getFullYear()} UserFlow · User Management Dashboard ·{" "}
          {theme.preset} theme
        </footer>
      </div>
    </div>
  );
}
