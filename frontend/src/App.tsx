
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  BookOpen,
  Wallet,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ArrowUpRight,
  School
} from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Students", icon: GraduationCap },
  { label: "Teachers", icon: Users },
  { label: "Attendance", icon: CalendarCheck },
  { label: "Exams & Results", icon: BookOpen },
  { label: "Fees", icon: Wallet },
  { label: "Reports", icon: BarChart3 },
  { label: "Settings", icon: Settings }
];

const stats = [
  { label: "Total Students", value: "1,248", change: "Demo data", icon: GraduationCap },
  { label: "Teachers", value: "64", change: "Demo data", icon: Users },
  { label: "Attendance", value: "94.2%", change: "Sample rate", icon: CalendarCheck },
  { label: "Fee Collection", value: "৳2.4L", change: "Sample amount", icon: Wallet }
];

export default function App() {
  const [active, setActive] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="app-shell">
      {menuOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><School size={25} /></div>
          <div>
            <strong>ISS School</strong>
            <span>MANAGEMENT</span>
          </div>
          <button
            className="icon-button close-menu"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="school-switcher">
          <div className="school-avatar">IS</div>
          <div className="school-details">
            <strong>Demo School</strong>
            <span>School workspace</span>
          </div>
          <span className="switch-arrow">⌄</span>
        </div>

        <p className="nav-heading">WORKSPACE</p>

        <nav className="navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`nav-item ${active === item.label ? "active" : ""}`}
                onClick={() => {
                  setActive(item.label);
                  setMenuOpen(false);
                }}
              >
                <Icon size={19} />
                <span>{item.label}</span>
                {active === item.label && <span className="active-dot" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">?</div>
            <strong>Need help?</strong>
            <p>Visit the help center for guidance.</p>
            <button onClick={() => setActive("Help Center")}>
              Open Help Center <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="version">ISS School Management · v1.0</div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={23} />
          </button>

          <div className="breadcrumb">
            <span>ISS</span><span>/</span><strong>{active}</strong>
          </div>

          <div className="top-actions">
            <label className="search-box">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search..."
                aria-label="Search dashboard"
              />
              <kbd>/</kbd>
            </label>
            <button
              className="icon-button notification"
              aria-label="Notifications"
              onClick={() => window.alert("Demo: no new notifications.")}
            >
              <Bell size={20} />
              <span />
            </button>
            <div className="profile-avatar">IS</div>
          </div>
        </header>

        <div className="page-content">
          <div className="welcome-row">
            <div>
              <div className="eyebrow">MONDAY · SCHOOL WORKSPACE</div>
              <h1>{active}</h1>
              <p className="subtitle">
                Welcome to your school management workspace.
              </p>
            </div>
            <div className="date-chip">
              <CalendarCheck size={17} />
              <span>Demo Preview</span>
            </div>
          </div>

          {active === "Dashboard" ? (
            <>
              <section className="notice-banner">
                <div className="notice-symbol"><School size={23} /></div>
                <div>
                  <strong>Welcome to ISS School Management</strong>
                  <p>
                    Your school operations, organized in one workspace.
                    The numbers below are sample data.
                  </p>
                </div>
              </section>

              <section className="stats-grid">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <article className="stat-card" key={stat.label}>
                      <div className="stat-top">
                        <div className="stat-icon"><Icon size={21} /></div>
                        <span className="stat-arrow"><ArrowUpRight size={17} /></span>
                      </div>
                      <p>{stat.label}</p>
                      <h2>{stat.value}</h2>
                      <span className="stat-note">{stat.change}</span>
                    </article>
                  );
                })}
              </section>

              <section className="content-grid">
                <article className="panel attendance-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Attendance Overview</h3>
                      <p>Illustrative weekly attendance</p>
                    </div>
                    <span className="pill">Demo</span>
                  </div>
                  <div className="chart">
                    {[65, 83, 74, 92, 79, 96, 58].map((height, index) => (
                      <div className="chart-column" key={index}>
                        <div className="bar-track">
                          <div
                            className={`bar ${index === 3 ? "bar-highlight" : ""}`}
                            style={{ height: `${height}%` }}
                          />
                        </div>
                        <span>{["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"][index]}</span>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="panel activity-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Quick Actions</h3>
                      <p>Common school tasks</p>
                    </div>
                  </div>
                  {[
                    ["Add Student", GraduationCap, "Students"],
                    ["Mark Attendance", CalendarCheck, "Attendance"],
                    ["Enter Exam Results", BookOpen, "Exams & Results"],
                    ["Record a Fee", Wallet, "Fees"]
                  ].map(([label, Icon, target]) => {
                    const ActionIcon = Icon as typeof GraduationCap;
                    return (
                      <button
                        className="quick-action"
                        key={label as string}
                        onClick={() => setActive(target as string)}
                      >
                        <span className="quick-icon"><ActionIcon size={18} /></span>
                        <span>{label as string}</span>
                        <ArrowUpRight size={16} />
                      </button>
                    );
                  })}
                </article>
              </section>

              <section className="panel bottom-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Recent School Updates</h3>
                    <p>Sample activity for preview only</p>
                  </div>
                </div>
                <div className="empty-state">
                  <div className="empty-icon"><Bell size={23} /></div>
                  <strong>No live activity yet</strong>
                  <p>Connect the backend to show real school updates.</p>
                </div>
              </section>
            </>
          ) : (
            <section className="panel section-preview">
              <div className="preview-icon"><LayoutDashboard size={26} /></div>
              <h2>{active}</h2>
              <p>
                This section is part of the planned ISS School Management
                system. Its data and actions will be added after secure
                login and database integration.
              </p>
              <span className="pill">UI preview · Not connected</span>
              <button className="primary-button" onClick={() => setActive("Dashboard")}>
                Back to Dashboard
              </button>
            </section>
          )}

          <footer className="footer">
            <span>© ISS · International System Security</span>
            <span>Secure school management · Preview build</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
