export default function DashboardLayout({ user, onLogout, onCreate, children }) {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <h1>Repair Dashboard</h1>
          <p>Welcome back, {user.name} ({user.role})</p>
        </div>
        <div className="topbar-actions">
          <button className="secondary" onClick={onLogout}>
            Log out
          </button>
          <button className="primary" onClick={onCreate}>
            + New Repair
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}
