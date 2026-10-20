import "./LandingPage.css";

const features = [
  {
    icon: "🎓",
    title: "Student Management",
    description: "Manage student profiles, admission records, and guardian information.",
  },
  {
    icon: "📅",
    title: "Attendance Tracking",
    description: "Record daily attendance and monitor student participation.",
  },
  {
    icon: "📝",
    title: "Exam Management",
    description: "Organize examinations, publish results, and track progress.",
  },
  {
    icon: "💳",
    title: "Fee Management",
    description: "Keep fee records organized and simplify payment tracking.",
  },
  {
    icon: "👩‍🏫",
    title: "Teacher Management",
    description: "Organize teacher profiles, classes, and responsibilities.",
  },
  {
    icon: "🏫",
    title: "Class Management",
    description: "Manage classes, sections, and subject assignments.",
  },
  {
    icon: "📊",
    title: "Reports & Analytics",
    description: "Understand school performance with organized reports.",
  },
  {
    icon: "🔒",
    title: "Secure & Reliable",
    description: "Keep school information protected with role-based access.",
  },
];

const demoStats = [
  { value: "500+", label: "Schools" },
  { value: "50K+", label: "Students" },
  { value: "2K+", label: "Teachers" },
  { value: "24/7", label: "Access" },
];

export default function LandingPage() {
  const openPage = (page: string) => {
    window.location.href = page;
  };

  return (
    <div className="iss-landing">
      <header className="iss-header">
        <a className="iss-brand" href="#home" aria-label="ISS School Management Home">
          <span className="iss-brand-icon">🎓</span>
          <span>
            <strong>ISS School Management</strong>
            <small>Smart School · Better Future</small>
          </span>
        </a>

        <nav className="iss-nav" aria-label="Main navigation">
          <a className="active" href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#demo">Live Demo</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="iss-header-actions">
          <button
            className="iss-btn iss-btn-outline iss-login-btn"
            onClick={() => openPage("/login")}
          >
            Login
          </button>
          <button
            className="iss-btn iss-btn-primary iss-small-btn"
            onClick={() => openPage("/register")}
          >
            Get Started
          </button>
        </div>
      </header>

      <main>
        <section className="iss-hero" id="home">
          <div className="iss-hero-content">
            <span className="iss-eyebrow">
              <span className="iss-dot" />
              Complete School Management Solution
            </span>

            <h1>
              Manage Your School
              <span>Smarter &amp; Easier</span>
            </h1>

            <p className="iss-hero-description">
              ISS School Management is a modern, easy-to-use platform for
              managing your entire school. From students to exams, attendance
              to fees — everything in one place.
            </p>

            <div className="iss-hero-actions">
              <button
                className="iss-btn iss-btn-primary"
                onClick={() => openPage("/register")}
              >
                Get Started Free <span>→</span>
              </button>
              <a className="iss-btn iss-btn-outline" href="#demo">
                <span>▶</span> Explore Live Demo
              </a>
            </div>

            <div className="iss-trust-points">
              <span>✓ No Installation Required</span>
              <span>✓ Secure &amp; Reliable</span>
              <span>✓ Easy to Use</span>
            </div>
          </div>

          <div className="iss-hero-visual">
            <div className="iss-orbit iss-orbit-one" />
            <div className="iss-orbit iss-orbit-two" />

            <div className="iss-dashboard">
              <aside className="iss-dashboard-sidebar">
                <strong>🎓 ISS School</strong>
                <span className="selected">▦ Dashboard</span>
                <span>♙ Students</span>
                <span>♧ Teachers</span>
                <span>▣ Attendance</span>
                <span>▤ Examinations</span>
                <span>৳ Fees</span>
                <span>▥ Classes</span>
                <span>▦ Reports</span>
              </aside>

              <div className="iss-dashboard-main">
                <div className="iss-dashboard-top">
                  <span>Welcome back!</span>
                  <span className="iss-admin-chip">Administrator</span>
                </div>

                <h3>School Overview</h3>

                <div className="iss-stat-grid">
                  <div className="iss-stat-card blue">
                    <small>Students</small>
                    <strong>248</strong>
                    <span>Registered</span>
                  </div>
                  <div className="iss-stat-card green">
                    <small>Teachers</small>
                    <strong>18</strong>
                    <span>Active staff</span>
                  </div>
                  <div className="iss-stat-card orange">
                    <small>Classes</small>
                    <strong>12</strong>
                    <span>Organized</span>
                  </div>
                  <div className="iss-stat-card purple">
                    <small>Attendance</small>
                    <strong>92%</strong>
                    <span>Today's sample</span>
                  </div>
                </div>

                <div className="iss-dashboard-bottom">
                  <div className="iss-activity-card">
                    <strong>Recent Activity</strong>
                    <p>● Student record updated</p>
                    <p>● Attendance recorded</p>
                    <p>● Exam schedule prepared</p>
                    <p>● Fee record updated</p>
                  </div>
                  <div className="iss-chart-card">
                    <strong>Attendance Overview</strong>
                    <div className="iss-chart">
                      {[45, 65, 54, 80, 68, 88, 73, 92].map(
                        (height, index) => (
                          <span
                            key={index}
                            style={{ height: `${height}%` }}
                          />
                        )
                      )}
                    </div>
                    <small>Weekly sample data</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="iss-floating-note">
              <span>✓</span>
              <div>
                <strong>Everything organized</strong>
                <small>Your school, one platform</small>
              </div>
            </div>
          </div>
        </section>

        <section className="iss-features section-wrap" id="features">
          <div className="iss-section-heading">
            <span className="iss-eyebrow">Our Features</span>
            <h2>Everything You Need to Manage Your School</h2>
            <p>
              Powerful, practical tools that make school administration
              simpler, more organized, and more efficient.
            </p>
          </div>

          <div className="iss-feature-grid">
            {features.map((feature) => (
              <article className="iss-feature-card" key={feature.title}>
                <span className="iss-feature-icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="iss-stats-band" id="about">
          <div className="iss-stats-intro">
            <h2>Built for Better School Management</h2>
            <p>One platform for your school's everyday needs.</p>
          </div>

          <div className="iss-stats-list">
            {demoStats.map((stat) => (
              <div className="iss-public-stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <small className="iss-stats-note">
            Illustrative figures for the design preview, not verified platform totals.
          </small>
        </section>

        <section className="iss-demo-section" id="demo">
          <div className="iss-demo-icon">💻</div>
          <div className="iss-demo-copy">
            <span className="iss-eyebrow">Try It Now</span>
            <h2>Explore Our Live Demo</h2>
            <p>
              Discover the interface and see how a school management system
              can organize everyday tasks. Demo data should remain separate
              from real school records.
            </p>
            <button
              className="iss-btn iss-btn-primary"
              onClick={() => openPage("/demo")}
            >
              Explore Demo <span>→</span>
            </button>
          </div>
          <div className="iss-demo-info">
            <span className="iss-demo-info-icon">✦</span>
            <div>
              <strong>Your school, simplified</strong>
              <p>Students · Attendance · Exams · Fees</p>
              <small>
                Sample dashboard preview. Demo access must be configured
                separately.
              </small>
            </div>
          </div>
        </section>

        <section className="iss-cta-section" id="contact">
          <span className="iss-eyebrow">Get Started Today</span>
          <h2>Ready to Simplify Your School Management?</h2>
          <p>
            Bring your school operations together in one organized platform.
          </p>
          <button
            className="iss-btn iss-btn-light"
            onClick={() => openPage("/register")}
          >
            Register Your School <span>→</span>
          </button>
        </section>
      </main>

      <footer className="iss-footer">
        <div className="iss-footer-main">
          <a className="iss-brand iss-footer-brand" href="#home">
            <span className="iss-brand-icon">🎓</span>
            <span>
              <strong>ISS School Management</strong>
              <small>Smart School · Better Future</small>
            </span>
          </a>

          <nav className="iss-footer-links" aria-label="Footer navigation">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#demo">Live Demo</a>
            <a href="/installation">Installation Guide</a>
          </nav>
        </div>

        <div className="iss-footer-bottom">
          <span>© {new Date().getFullYear()} ISS School Management</span>
          <span>Designed for smarter education.</span>
        </div>
      </footer>
    </div>
  );
}