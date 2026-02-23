import { useState, useEffect, createContext, useContext } from "react";

// ── Config ────────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:8000";

// ── Auth Context ──────────────────────────────────────────────────────────────
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

// ── API helpers ───────────────────────────────────────────────────────────────
const api = {
  request: async (path, options = {}) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(err.detail || "Request failed");
    }
    return res.json();
  },
  post: (path, body) => api.request(path, { method: "POST", body: JSON.stringify(body) }),
  get: (path) => api.request(path),
  del: (path) => api.request(path, { method: "DELETE" }),
};

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toasts, remove }) {
  return (
    <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => remove(t.id)}
          style={{
            background: t.type === "error" ? "#ff4757" : t.type === "success" ? "#2ed573" : "#1e90ff",
            color: t.type === "success" ? "#0a2a1a" : "#fff",
            padding: "12px 20px",
            borderRadius: 12,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            maxWidth: 320,
            animation: "slideIn .3s ease",
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

let toastId = 0;
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (message, type = "info") => {
    const id = ++toastId;
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => remove(id), 4000);
  };
  const remove = (id) => setToasts((p) => p.filter((t) => t.id !== id));
  return { toasts, add, remove };
}

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0b0f1a;
    --surface: #131929;
    --surface2: #1a2340;
    --border: rgba(255,255,255,0.07);
    --accent: #6c63ff;
    --accent2: #ff6584;
    --accent3: #43e97b;
    --text: #e8eaf6;
    --muted: #8891b0;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --radius: 16px;
    --radius-sm: 10px;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }

  @keyframes slideIn { from { opacity:0; transform: translateX(40px); } to { opacity:1; transform:translateX(0); } }
  @keyframes fadeUp  { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse   { 0%,100% { opacity:1; } 50% { opacity:.5; } }

  .app-layout { display: flex; height: 100vh; overflow: hidden; }

  /* Sidebar */
  .sidebar {
    width: 260px; min-width: 260px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    padding: 0 0 24px;
    position: relative;
    overflow: hidden;
  }
  .sidebar::before {
    content:''; position:absolute; top:-80px; left:-80px;
    width:220px; height:220px; border-radius:50%;
    background: radial-gradient(circle, rgba(108,99,255,.25) 0%, transparent 70%);
    pointer-events:none;
  }
  .sidebar-logo {
    padding: 28px 24px 20px;
    font-family: var(--font-display);
    font-size: 22px; font-weight: 800;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, #6c63ff, #ff6584);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .sidebar-logo span { display:block; font-size:11px; font-weight:400; color:var(--muted); -webkit-text-fill-color: var(--muted); letter-spacing:1px; text-transform:uppercase; margin-top:2px; }
  .sidebar-divider { height:1px; background:var(--border); margin: 0 24px 16px; }
  .sidebar-nav { flex:1; display:flex; flex-direction:column; gap:4px; padding:0 12px; }
  .nav-item {
    display:flex; align-items:center; gap:12px;
    padding:11px 14px; border-radius:var(--radius-sm);
    cursor:pointer; font-size:14px; font-weight:500; color:var(--muted);
    transition: all .2s;
    border: 1px solid transparent;
  }
  .nav-item:hover { background:var(--surface2); color:var(--text); }
  .nav-item.active { background: rgba(108,99,255,.15); color:#a5a1ff; border-color:rgba(108,99,255,.3); }
  .nav-item .icon { font-size:18px; width:22px; text-align:center; }
  .sidebar-footer { padding: 0 12px; }
  .user-card {
    display:flex; align-items:center; gap:12px;
    padding:12px 14px; border-radius:var(--radius-sm);
    background:var(--surface2); cursor:pointer;
  }
  .avatar {
    width:36px; height:36px; border-radius:50%;
    background: linear-gradient(135deg, #6c63ff, #ff6584);
    display:flex; align-items:center; justify-content:center;
    font-weight:700; font-size:14px; color:#fff; flex-shrink:0;
  }
  .user-card-info { flex:1; min-width:0; }
  .user-card-name { font-size:13px; font-weight:600; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .user-card-role { font-size:11px; color:var(--muted); }

  /* Main */
  .main-content { flex:1; overflow-y:auto; padding:32px; animation: fadeUp .4s ease; }
  .page-header { margin-bottom:32px; }
  .page-header h1 { font-family:var(--font-display); font-size:28px; font-weight:800; letter-spacing:-0.5px; }
  .page-header p { color:var(--muted); font-size:14px; margin-top:4px; }

  /* Cards */
  .card {
    background:var(--surface); border:1px solid var(--border);
    border-radius:var(--radius); padding:24px;
    transition: border-color .2s;
  }
  .card:hover { border-color:rgba(108,99,255,.25); }
  .card-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:16px; }
  .stat-card {
    background:var(--surface); border:1px solid var(--border);
    border-radius:var(--radius); padding:20px;
    display:flex; align-items:center; gap:16px;
  }
  .stat-icon {
    width:48px; height:48px; border-radius:12px;
    display:flex; align-items:center; justify-content:center;
    font-size:22px;
  }
  .stat-info label { font-size:12px; color:var(--muted); text-transform:uppercase; letter-spacing:.5px; }
  .stat-info .val { font-family:var(--font-display); font-size:26px; font-weight:800; }

  /* Table */
  .table-wrap { overflow-x:auto; border-radius:var(--radius); border:1px solid var(--border); }
  table { width:100%; border-collapse:collapse; font-size:14px; }
  thead tr { background:var(--surface2); }
  th { padding:14px 16px; text-align:left; font-size:12px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:.5px; white-space:nowrap; }
  td { padding:14px 16px; border-top:1px solid var(--border); vertical-align:middle; }
  tr:hover td { background:rgba(255,255,255,.02); }

  /* Badge */
  .badge {
    display:inline-flex; align-items:center;
    padding:3px 10px; border-radius:999px;
    font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.4px;
  }
  .badge-upcoming  { background:rgba(108,99,255,.18); color:#a5a1ff; }
  .badge-cancelled { background:rgba(255,71,87,.15);  color:#ff6b6b; }
  .badge-done      { background:rgba(46,213,115,.15); color:#2ed573; }

  /* Buttons */
  .btn {
    display:inline-flex; align-items:center; gap:8px;
    padding:10px 20px; border-radius:var(--radius-sm);
    font-family:var(--font-body); font-size:14px; font-weight:600;
    cursor:pointer; border:none; transition:all .2s;
  }
  .btn-primary { background:var(--accent); color:#fff; }
  .btn-primary:hover { background:#5a52e8; transform:translateY(-1px); box-shadow:0 8px 24px rgba(108,99,255,.4); }
  .btn-danger { background:rgba(255,71,87,.15); color:#ff6b6b; border:1px solid rgba(255,71,87,.3); }
  .btn-danger:hover { background:rgba(255,71,87,.25); }
  .btn-ghost { background:transparent; color:var(--muted); border:1px solid var(--border); }
  .btn-ghost:hover { background:var(--surface2); color:var(--text); }
  .btn-sm { padding:6px 14px; font-size:12px; }
  .btn:disabled { opacity:.5; cursor:not-allowed; transform:none !important; }

  /* Forms */
  .form-group { margin-bottom:20px; }
  .form-group label { display:block; font-size:13px; font-weight:600; color:var(--muted); margin-bottom:8px; text-transform:uppercase; letter-spacing:.4px; }
  .form-control {
    width:100%; padding:12px 16px;
    background:var(--surface2); border:1px solid var(--border);
    border-radius:var(--radius-sm); color:var(--text);
    font-family:var(--font-body); font-size:14px;
    transition:border-color .2s;
    outline:none;
  }
  .form-control:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(108,99,255,.15); }
  .form-control::placeholder { color:var(--muted); opacity:.6; }
  .form-error { color:#ff6b6b; font-size:12px; margin-top:5px; }
  .form-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }

  /* Auth pages */
  .auth-page {
    flex:1; min-height:100vh; display:flex; align-items:center; justify-content:center;
    background: var(--bg);
    position:relative; overflow:hidden;
  }
  .auth-page::before {
    content:''; position:absolute; top:-200px; right:-200px;
    width:600px; height:600px; border-radius:50%;
    background: radial-gradient(circle, rgba(108,99,255,.12) 0%, transparent 70%);
  }
  .auth-page::after {
    content:''; position:absolute; bottom:-150px; left:-100px;
    width:400px; height:400px; border-radius:50%;
    background: radial-gradient(circle, rgba(255,101,132,.1) 0%, transparent 70%);
  }
  .auth-card {
    width:440px; max-width:95vw;
    background:var(--surface); border:1px solid var(--border);
    border-radius:24px; padding:40px;
    position:relative; z-index:1;
    box-shadow: 0 32px 80px rgba(0,0,0,.5);
    animation: fadeUp .4s ease;
  }
  .auth-logo {
    font-family:var(--font-display); font-size:26px; font-weight:800;
    background: linear-gradient(135deg,#6c63ff,#ff6584);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    margin-bottom:8px;
  }
  .auth-subtitle { color:var(--muted); font-size:14px; margin-bottom:32px; }
  .auth-switch { text-align:center; margin-top:24px; font-size:14px; color:var(--muted); }
  .auth-switch button { background:none; border:none; color:var(--accent); cursor:pointer; font-weight:600; font-family:var(--font-body); }

  /* Appointment card */
  .appt-card {
    background:var(--surface); border:1px solid var(--border);
    border-radius:var(--radius); padding:20px;
    transition:all .2s;
    animation:fadeUp .3s ease;
  }
  .appt-card:hover { border-color:rgba(108,99,255,.3); transform:translateY(-2px); box-shadow:0 12px 32px rgba(0,0,0,.3); }
  .appt-date { font-family:var(--font-display); font-size:13px; font-weight:700; color:var(--accent); margin-bottom:6px; text-transform:uppercase; letter-spacing:.5px; }
  .appt-title { font-size:15px; font-weight:600; margin-bottom:4px; }
  .appt-desc { font-size:13px; color:var(--muted); line-height:1.5; }

  /* Modal */
  .modal-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,.7);
    display:flex; align-items:center; justify-content:center;
    z-index:1000; backdrop-filter:blur(4px);
    animation: fadeIn .2s ease;
  }
  .modal {
    background:var(--surface); border:1px solid var(--border);
    border-radius:24px; padding:36px; width:520px; max-width:95vw;
    position:relative;
    animation: fadeUp .3s ease;
    box-shadow: 0 32px 80px rgba(0,0,0,.6);
  }
  .modal h2 { font-family:var(--font-display); font-size:22px; font-weight:800; margin-bottom:24px; }
  .modal-close { position:absolute; top:20px; right:20px; background:none; border:none; color:var(--muted); cursor:pointer; font-size:22px; line-height:1; }

  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

  /* Search */
  .search-bar {
    display:flex; align-items:center; gap:12px;
    background:var(--surface2); border:1px solid var(--border);
    border-radius:var(--radius-sm); padding:10px 16px; margin-bottom:20px;
  }
  .search-bar input { background:none; border:none; outline:none; color:var(--text); font-family:var(--font-body); font-size:14px; flex:1; }
  .search-bar input::placeholder { color:var(--muted); }

  /* Empty state */
  .empty { text-align:center; padding:60px 20px; color:var(--muted); }
  .empty-icon { font-size:48px; margin-bottom:16px; opacity:.4; }
  .empty p { font-size:15px; }

  /* Scrollbar */
  ::-webkit-scrollbar { width:6px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:var(--border); border-radius:3px; }

  /* Responsive */
  @media (max-width:768px) {
    .sidebar { display:none; }
    .main-content { padding:20px; }
    .form-grid-2 { grid-template-columns:1fr; }
  }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};
const fmtTime = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};
const statusBadge = (s) => {
  const map = { upcoming: "badge-upcoming", cancelled: "badge-cancelled", done: "badge-done" };
  return `badge ${map[s] || "badge-upcoming"}`;
};

// ── Components ────────────────────────────────────────────────────────────────

function Sidebar({ page, setPage, user, onLogout }) {
  const initials = user?.name ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "U";
  const navItems = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "appointments", icon: "📅", label: "My Appointments" },
    { id: "book", icon: "＋", label: "Book Appointment" },
    { id: "profile", icon: "◎", label: "Profile" },
    ...(user?.role === "admin" ? [{ id: "admin", icon: "⚙", label: "Admin View" }] : []),
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        Schedula
        <span>Appointment System</span>
      </div>
      <div className="sidebar-divider" />
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${page === item.id ? "active" : ""}`}
            onClick={() => setPage(item.id)}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </div>
        ))}
        <div className="nav-item" onClick={onLogout} style={{ marginTop: "auto", color: "#ff6b6b" }}>
          <span className="icon">→</span> Logout
        </div>
      </nav>
      <div className="sidebar-footer">
        <div className="user-card" onClick={() => setPage("profile")}>
          <div className="avatar">{initials}</div>
          <div className="user-card-info">
            <div className="user-card-name">{user?.name || "User"}</div>
            <div className="user-card-role">{user?.role || "member"}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ── Login / Register ──────────────────────────────────────────────────────────
function AuthPage({ onAuth, toast }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (mode === "register" && !form.name.trim()) e.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (form.password.length < 6) e.password = "Min 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === "login") {
        const data = await api.post("/auth/login", { email: form.email, password: form.password });
        localStorage.setItem("token", data.access_token);
        const me = await api.get("/auth/me");
        onAuth(me);
        toast("Welcome back! 👋", "success");
      } else {
        await api.post("/auth/register", { name: form.name, email: form.email, password: form.password });
        toast("Account created! Please log in.", "success");
        setMode("login");
      }
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Schedula</div>
        <p className="auth-subtitle">{mode === "login" ? "Sign in to manage your appointments." : "Create your account to get started."}</p>
        {mode === "register" && (
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-control" placeholder="John Doe" value={form.name} onChange={set("name")} />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>
        )}
        <div className="form-group">
          <label>Email</label>
          <input className="form-control" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input className="form-control" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} onKeyDown={(e) => e.key === "Enter" && submit()} />
          {errors.password && <p className="form-error">{errors.password}</p>}
        </div>
        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px" }} onClick={submit} disabled={loading}>
          {loading ? "Please wait…" : mode === "login" ? "Sign In →" : "Create Account →"}
        </button>
        <div className="auth-switch">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setErrors({}); }}>
            {mode === "login" ? "Register" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ user, appointments, onBook }) {
  const now = new Date();
  const upcoming = appointments.filter((a) => new Date(a.datetime) > now);
  const past = appointments.filter((a) => new Date(a.datetime) <= now);

  const stats = [
    { label: "Total", value: appointments.length, icon: "📅", color: "rgba(108,99,255,.2)", text: "#a5a1ff" },
    { label: "Upcoming", value: upcoming.length, icon: "⬆", color: "rgba(46,213,115,.15)", text: "#2ed573" },
    { label: "Past", value: past.length, icon: "🕑", color: "rgba(255,71,87,.15)", text: "#ff6b6b" },
  ];

  return (
    <div>
      <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1>Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {user?.name?.split(" ")[0] || "there"} ✦</h1>
          <p>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
        </div>
        <button className="btn btn-primary" onClick={onBook}>＋ &nbsp;New Appointment</button>
      </div>

      <div className="card-grid" style={{ marginBottom: 28 }}>
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.color, color: s.text }}>{s.icon}</div>
            <div className="stat-info">
              <label>{s.label}</label>
              <div className="val" style={{ color: s.text }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Upcoming Appointments</h2>
        {upcoming.length === 0 ? (
          <div className="empty"><div className="empty-icon">📭</div><p>No upcoming appointments. Book one!</p></div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {upcoming.slice(0, 5).map((a) => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 700, marginBottom: 2 }}>
                    {fmtDate(a.datetime)} · {fmtTime(a.datetime)}
                  </div>
                  <div style={{ fontWeight: 600 }}>{a.service || "Appointment"}</div>
                </div>
                <span className="badge badge-upcoming">upcoming</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── My Appointments ───────────────────────────────────────────────────────────
function MyAppointments({ appointments, onCancel, onBook }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const now = new Date();

  const filtered = appointments.filter((a) => {
    const isUpcoming = new Date(a.datetime) > now;
    const status = isUpcoming ? "upcoming" : "done";
    const matchStatus = filter === "all" || status === filter;
    const matchSearch = !search || (a.service || "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1>My Appointments</h1>
          <p>View and manage all your bookings.</p>
        </div>
        <button className="btn btn-primary" onClick={onBook}>＋ &nbsp;New</button>
      </div>

      <div className="search-bar">
        <span style={{ color: "var(--muted)" }}>🔍</span>
        <input placeholder="Search by service name…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["all", "upcoming", "done"].map((f) => (
          <button key={f} className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-ghost"}`} onClick={() => setFilter(f)} style={{ textTransform: "capitalize" }}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty"><div className="empty-icon">📋</div><p>No appointments found.</p></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date &amp; Time</th>
                <th>Service</th>
                <th>Booked On</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const isUpcoming = new Date(a.datetime) > now;
                return (
                  <tr key={a.id}>
                    <td style={{ whiteSpace: "nowrap" }}>{fmtDate(a.datetime)}<br /><span style={{ color: "var(--muted)", fontSize: 12 }}>{fmtTime(a.datetime)}</span></td>
                    <td style={{ fontWeight: 600 }}>{a.service || "—"}</td>
                    <td style={{ color: "var(--muted)", fontSize: 13 }}>{fmtDate(a.created_at)}</td>
                    <td><span className={isUpcoming ? "badge badge-upcoming" : "badge badge-done"}>{isUpcoming ? "upcoming" : "done"}</span></td>
                    <td>
                      {isUpcoming && (
                        <button className="btn btn-sm btn-danger" onClick={() => onCancel(a.id)}>Cancel</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Book Appointment Modal/Page ───────────────────────────────────────────────
function BookForm({ onSuccess, onClose, toast, inline = false }) {
  const [form, setForm] = useState({ service: "", date: "", time: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.service.trim()) e.service = "Service name is required";
    if (!form.date) e.date = "Date is required";
    if (!form.time) e.time = "Time is required";
    if (form.date && new Date(form.date) < new Date(new Date().toDateString())) e.date = "Date must be today or later";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // Combine date + time into ISO string for appointment_time
      const appointment_time = new Date(`${form.date}T${form.time}`).toISOString();
      await api.post("/appointments/", { service: form.service, appointment_time });
      toast("Appointment booked! 🎉", "success");
      onSuccess();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const formContent = (
    <>
      <div className="form-group">
        <label>Service *</label>
        <input className="form-control" placeholder="e.g. Dental Checkup, Haircut, Consultation" value={form.service} onChange={set("service")} />
        {errors.service && <p className="form-error">{errors.service}</p>}
      </div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Date *</label>
          <input className="form-control" type="date" value={form.date} onChange={set("date")} min={new Date().toISOString().split("T")[0]} />
          {errors.date && <p className="form-error">{errors.date}</p>}
        </div>
        <div className="form-group">
          <label>Time *</label>
          <input className="form-control" type="time" value={form.time} onChange={set("time")} />
          {errors.time && <p className="form-error">{errors.time}</p>}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={submit} disabled={loading}>
          {loading ? "Booking…" : "Book Appointment →"}
        </button>
      </div>
    </>
  );

  if (inline) return formContent;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Book Appointment ✦</h2>
        {formContent}
      </div>
    </div>
  );
}

// ── Admin View ────────────────────────────────────────────────────────────────
function AdminView({ toast }) {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const now = new Date();

  useEffect(() => {
    api.get("/appointments/all")
      .then(setAppts)
      .catch((e) => toast(e.message, "error"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = appts.filter((a) => {
    const matchSearch = !search || JSON.stringify(a).toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const upcoming = appts.filter((a) => new Date(a.appointment_time) > now).length;

  return (
    <div>
      <div className="page-header">
        <h1>Admin Dashboard ⚙</h1>
        <p>All appointments across all users.</p>
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        <div className="stat-card" style={{ flex: 1 }}>
          <div className="stat-icon" style={{ background: "rgba(108,99,255,.2)", color: "#a5a1ff" }}>📊</div>
          <div className="stat-info"><label>Total</label><div className="val">{appts.length}</div></div>
        </div>
        <div className="stat-card" style={{ flex: 1 }}>
          <div className="stat-icon" style={{ background: "rgba(46,213,115,.15)", color: "#2ed573" }}>⬆</div>
          <div className="stat-info"><label>Upcoming</label><div className="val" style={{ color: "#2ed573" }}>{upcoming}</div></div>
        </div>
        <div className="stat-card" style={{ flex: 1 }}>
          <div className="stat-icon" style={{ background: "rgba(255,71,87,.15)", color: "#ff6b6b" }}>🕑</div>
          <div className="stat-info"><label>Past</label><div className="val" style={{ color: "#ff6b6b" }}>{appts.length - upcoming}</div></div>
        </div>
      </div>
      <div className="search-bar">
        <span style={{ color: "var(--muted)" }}>🔍</span>
        <input placeholder="Search appointments, users…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      {loading ? <div style={{ color: "var(--muted)", padding: 40, textAlign: "center", animation: "pulse 1.5s infinite" }}>Loading…</div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Service</th>
                <th>Appointment Time</th>
                <th>Booked On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a._id}>
                  <td style={{ color: "var(--muted)", fontSize: 11, maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis" }}>#{a._id}</td>
                  <td style={{ color: "var(--muted)", fontSize: 12 }}>{a.user_id || "—"}</td>
                  <td style={{ fontWeight: 600 }}>{a.service || "—"}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{fmtDate(a.appointment_time)}<br /><span style={{ color: "var(--muted)", fontSize: 12 }}>{fmtTime(a.appointment_time)}</span></td>
                  <td style={{ color: "var(--muted)", fontSize: 13 }}>{fmtDate(a.created_at)}</td>
                  <td><span className={new Date(a.appointment_time) > now ? "badge badge-upcoming" : "badge badge-done"}>{new Date(a.appointment_time) > now ? "upcoming" : "done"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="empty"><div className="empty-icon">📋</div><p>No results.</p></div>}
        </div>
      )}
    </div>
  );
}

// ── Profile Page ──────────────────────────────────────────────────────────────
function ProfilePage({ user, appointments }) {
  const initials = user?.name ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "U";
  const now = new Date();
  const upcoming = appointments.filter((a) => new Date(a.datetime) > now).length;

  return (
    <div>
      <div className="page-header"><h1>Profile</h1><p>Your account details and statistics.</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
        <div className="card" style={{ textAlign: "center" }}>
          <div className="avatar" style={{ width: 80, height: 80, fontSize: 28, margin: "0 auto 16px" }}>{initials}</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20 }}>{user?.name}</div>
          <div style={{ color: "var(--muted)", fontSize: 14, margin: "4px 0 12px" }}>{user?.email}</div>
          <span className="badge badge-upcoming" style={{ display: "inline-flex" }}>{user?.role || "member"}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: 16 }}>Account Info</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[["Full Name", user?.name], ["Email", user?.email], ["Role", user?.role || "member"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--muted)" }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div className="stat-card"><div className="stat-icon" style={{ background: "rgba(108,99,255,.2)", color: "#a5a1ff" }}>📅</div><div className="stat-info"><label>Total</label><div className="val">{appointments.length}</div></div></div>
            <div className="stat-card"><div className="stat-icon" style={{ background: "rgba(46,213,115,.15)", color: "#2ed573" }}>⬆</div><div className="stat-info"><label>Upcoming</label><div className="val" style={{ color: "#2ed573" }}>{upcoming}</div></div></div>
            <div className="stat-card"><div className="stat-icon" style={{ background: "rgba(255,71,87,.15)", color: "#ff6b6b" }}>🕑</div><div className="stat-info"><label>Past</label><div className="val" style={{ color: "#ff6b6b" }}>{appointments.length - upcoming}</div></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── App Shell ─────────────────────────────────────────────────────────────────
export default function App() {
  const { toasts, add: addToast, remove } = useToast();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState("dashboard");
  const [showBook, setShowBook] = useState(false);
  const [loading, setLoading] = useState(true);

  // Try auto-login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/auth/me")
        .then((me) => { setUser(me); fetchAppointments(); })
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Normalize backend appointment fields to what UI expects
  const normalizeAppt = (a) => ({
    ...a,
    id: a.id || a._id,
    datetime: a.appointment_time,
    service: a.service,
    created_at: a.created_at,
  });

  const fetchAppointments = async () => {
    try {
      const data = await api.get("/appointments/my");
      setAppointments(Array.isArray(data) ? data.map(normalizeAppt) : []);
    } catch { }
  };

  const handleAuth = (me) => {
    setUser(me);
    fetchAppointments();
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setAppointments([]);
    setPage("dashboard");
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await api.del(`/appointments/${id}`);
      // Backend deletes the record, so remove it from local state
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      addToast("Appointment cancelled.", "info");
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  // After booking, refetch the list so we get the real data from the server
  const handleBooked = async () => {
    await fetchAppointments();
    setShowBook(false);
    setPage("appointments");
  };

  if (loading) return (
    <>
      <style>{STYLES}</style>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "var(--font-display)", color: "var(--muted)", animation: "pulse 1.5s infinite" }}>Loading…</div>
    </>
  );

  if (!user) return (
    <>
      <style>{STYLES}</style>
      <Toast toasts={toasts} remove={remove} />
      <AuthPage onAuth={handleAuth} toast={addToast} />
    </>
  );

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard user={user} appointments={appointments} onBook={() => setShowBook(true)} />;
      case "appointments": return <MyAppointments appointments={appointments} onCancel={handleCancel} onBook={() => setShowBook(true)} />;
      case "book": return (
        <div>
          <div className="page-header"><h1>Book Appointment</h1><p>Fill out the form to schedule a new appointment.</p></div>
          <div className="card" style={{ maxWidth: 560 }}>
            <BookForm onSuccess={handleBooked} onClose={() => setPage("appointments")} toast={addToast} inline />
          </div>
        </div>
      );
      case "profile": return <ProfilePage user={user} appointments={appointments} />;
      case "admin": return <AdminView toast={addToast} />;
      default: return null;
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <Toast toasts={toasts} remove={remove} />
      <div className="app-layout">
        <Sidebar page={page} setPage={setPage} user={user} onLogout={handleLogout} />
        <main className="main-content">{renderPage()}</main>
      </div>
      {showBook && page !== "book" && (
        <BookForm onSuccess={handleBooked} onClose={() => setShowBook(false)} toast={addToast} />
      )}
    </>
  );
}
