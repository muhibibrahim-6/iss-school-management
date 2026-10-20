@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

.iss-landing {
  --iss-blue: #0866f5;
  --iss-dark: #142b4f;
  --iss-text: #536782;
  --iss-border: #e3ebf6;
  color: var(--iss-dark);
  font-family: "Inter", Arial, sans-serif;
  background: #fff;
  min-height: 100vh;
  overflow: hidden;
}

.iss-landing * {
  box-sizing: border-box;
}

.iss-landing a {
  color: inherit;
  text-decoration: none;
}

.iss-landing button {
  font: inherit;
  cursor: pointer;
}

.iss-header {
  min-height: 78px;
  padding: 14px 7.5%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  background: #fff;
  border-bottom: 1px solid #edf2fa;
  position: relative;
  z-index: 5;
}

.iss-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.iss-brand-icon {
  font-size: 36px;
  line-height: 1;
}

.iss-brand strong,
.iss-brand small {
  display: block;
}

.iss-brand strong {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.4px;
}

.iss-brand small {
  color: var(--iss-text);
  font-size: 10px;
  margin-top: 5px;
}

.iss-nav {
  display: flex;
  align-items: center;
  gap: 26px;
}

.iss-nav a {
  color: #52647d;
  font-size: 12px;
  font-weight: 600;
  padding: 12px 0;
  transition: color 0.2s ease;
}

.iss-nav a:hover,
.iss-nav a.active {
  color: var(--iss-blue);
}

.iss-nav a.active {
  border-bottom: 2px solid var(--iss-blue);
}

.iss-header-actions,
.iss-hero-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.iss-btn {
  border: 1px solid transparent;
  min-height: 43px;
  padding: 12px 19px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 700;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.iss-btn:hover {
  transform: translateY(-2px);
}

.iss-btn-primary {
  color: #fff !important;
  background: var(--iss-blue);
  box-shadow: 0 5px 14px #0866f529;
}

.iss-btn-primary:hover {
  background: #0054d5;
  box-shadow: 0 8px 20px #0866f538;
}

.iss-btn-outline {
  color: var(--iss-blue) !important;
  border-color: #a9c9ff;
  background: #fff;
}

.iss-btn-outline:hover {
  background: #f3f8ff;
}

.iss-small-btn {
  padding: 11px 15px;
}

.iss-hero {
  padding: 76px 7.5% 70px;
  display: grid;
  grid-template-columns: 0.94fr 1.06fr;
  align-items: center;
  gap: 42px;
  position: relative;
  background:
    radial-gradient(ellipse at 82% 35%, #d9ecff 0, transparent 43%),
    linear-gradient(115deg, #f5faff, #edf6ff 62%, #f8fbff);
}

.iss-hero-content {
  position: relative;
  z-index: 2;
}

.iss-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border-radius: 30px;
  padding: 7px 12px;
  color: var(--iss-blue);
  background: #e1efff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1px;
}

.iss-dot {
  width: 7px;
  height: 7px;
  background: var(--iss-blue);
  border-radius: 50%;
}

.iss-hero h1 {
  font-size: clamp(34px, 4.2vw, 55px);
  line-height: 1.13;
  letter-spacing: -2px;
  margin: 20px 0 18px;
  font-weight: 800;
}

.iss-hero h1 span {
  display: block;
  color: var(--iss-blue);
}

.iss-hero-description {
  max-width: 490px;
  font-size: 14px;
  line-height: 1.9;
  color: #526782;
  margin: 0 0 24px;
}

.iss-hero-actions {
  flex-wrap: wrap;
}

.iss-trust-points {
  display: flex;
  flex-wrap: wrap;
  gap: 13px 20px;
  margin-top: 24px;
  color: #415772;
  font-size: 10px;
  font-weight: 600;
}

.iss-trust-points span::first-letter {
  color: #0bbd91;
}

.iss-hero-visual {
  min-width: 0;
  position: relative;
  padding: 15px 0;
}

.iss-orbit {
  position: absolute;
  border-radius: 50%;
  background: #d4e9ff;
  z-index: 0;
}

.iss-orbit-one {
  width: 260px;
  height: 260px;
  top: -38px;
  right: 4%;
}

.iss-orbit-two {
  width: 170px;
  height: 170px;
  bottom: -18px;
  left: 0;
  background: #e2f4ff;
}

.iss-dashboard {
  display: grid;
  grid-template-columns: 142px minmax(0, 1fr);
  min-height: 315px;
  position: relative;
  z-index: 1;
  background: white;
  border: 5px solid #d3e8ff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 24px 65px #3c83d926;
  transform: perspective(1000px) rotateY(-2deg);
}

.iss-dashboard-sidebar {
  padding: 18px 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #13294b;
  color: #e6f1ff;
  font-size: 10px;
}

.iss-dashboard-sidebar strong {
  margin-bottom: 12px;
  font-size: 12px;
  white-space: nowrap;
}

.iss-dashboard-sidebar span {
  padding: 8px 7px;
  border-radius: 5px;
  opacity: 0.87;
}

.iss-dashboard-sidebar .selected {
  background: #1769dd;
  opacity: 1;
}

.iss-dashboard-main {
  min-width: 0;
  padding: 17px 15px;
}

.iss-dashboard-top {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
  font-size: 10px;
  color: #63758c;
}

.iss-admin-chip {
  background: #eff5fc;
  padding: 6px 8px;
  border-radius: 6px;
}

.iss-dashboard-main h3 {
  font-size: 17px;
  margin: 18px 0 13px;
}

.iss-stat-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}

.iss-stat-card {
  padding: 12px;
  border-radius: 8px;
  color: white;
  min-width: 0;
}

.iss-stat-card small,
.iss-stat-card strong,
.iss-stat-card span {
  display: block;
}

.iss-stat-card small {
  font-size: 9px;
  opacity: 0.95;
}

.iss-stat-card strong {
  font-size: 23px;
  margin: 5px 0;
}

.iss-stat-card span {
  font-size: 8px;
  opacity: 0.9;
}

.iss-stat-card.blue {
  background: linear-gradient(135deg, #398cff, #2867ee);
}

.iss-stat-card.green {
  background: linear-gradient(135deg, #2ccba2, #10ad85);
}

.iss-stat-card.orange {
  background: linear-gradient(135deg, #ffbb50, #f59a24);
}

.iss-stat-card.purple {
  background: linear-gradient(135deg, #a28aff, #7b5be8);
}

.iss-dashboard-bottom {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 12px;
}

.iss-activity-card,
.iss-chart-card {
  padding: 12px 10px;
  border: 1px solid #edf1f7;
  border-radius: 8px;
  min-width: 0;
}

.iss-activity-card strong,
.iss-chart-card strong {
  font-size: 9px;
}

.iss-activity-card p {
  font-size: 8px;
  line-height: 1.5;
  color: #667992;
  margin: 11px 0 0;
}

.iss-activity-card p::first-letter {
  color: #13b991;
}

.iss-chart {
  height: 76px;
  display: flex;
  align-items: end;
  justify-content: space-around;
  gap: 5px;
  padding-top: 12px;
  margin-top: 7px;
  border-bottom: 1px solid #dce7f5;
  background: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 23px,
    #edf2f9 24px
  );
}

.iss-chart span {
  width: 10%;
  border-radius: 4px 4px 0 0;
  background: linear-gradient(to top, #1b75f7, #83bcff);
}

.iss-chart-card small {
  display: block;
  margin-top: 8px;
  color: #7a8ca3;
  font-size: 8px;
}

.iss-floating-note {
  position: absolute;
  z-index: 2;
  bottom: -4px;
  left: -20px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 17px;
  background: white;
  border: 1px solid #e9f1fc;
  border-radius: 12px;
  box-shadow: 0 10px 30px #204d8517;
}

.iss-floating-note > span {
  display: grid;
  place-items: center;
  width: 27px;
  height: 27px;
  color: #fff;
  background: #12c69a;
  border-radius: 50%;
}

.iss-floating-note strong,
.iss-floating-note small {
  display: block;
}

.iss-floating-note strong {
  font-size: 10px;
}

.iss-floating-note small {
  color: #75859b;
  font-size: 9px;
  margin-top: 4px;
}

.section-wrap {
  padding: 80px 7.5%;
}

.iss-features {
  display: grid;
  grid-template-columns: 0.75fr 1.5fr;
  gap: 45px;
  align-items: start;
}

.iss-section-heading h2,
.iss-demo-copy h2 {
  font-size: clamp(25px, 3vw, 34px);
  line-height: 1.3;
  letter-spacing: -1px;
  margin: 16px 0;
}

.iss-section-heading > p,
.iss-demo-copy > p {
  color: var(--iss-text);
  font-size: 13px;
  line-height: 1.9;
}

.iss-feature-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 32px 20px;
}

.iss-feature-card {
  min-width: 0;
}

.iss-feature-icon {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  font-size: 23px;
  border-radius: 12px;
  background: #edf5ff;
  border: 1px solid #d8e9ff;
}

.iss-feature-card:nth-child(2n) .iss-feature-icon {
  background: #e8faf5;
  border-color: #d0f3e8;
}

.iss-feature-card h3 {
  font-size: 12px;
  line-height: 1.5;
  margin: 13px 0 7px;
}

.iss-feature-card p {
  color: #687b93;
  font-size: 11px;
  line-height: 1.8;
  margin: 0;
}

.iss-stats-band {
  margin: 0 4.5%;
  padding: 35px 4%;
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  align-items: center;
  gap: 24px;
  color: #fff;
  background: linear-gradient(110deg, #2186ff, #7898ff 65%, #a2a8ff);
  border-radius: 20px;
  position: relative;
}

.iss-stats-intro h2 {
  font-size: 23px;
  line-height: 1.35;
  margin: 0 0 9px;
}

.iss-stats-intro p {
  font-size: 11px;
  line-height: 1.7;
  margin: 0;
  opacity: 0.92;
}

.iss-stats-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.iss-public-stat {
  text-align: center;
  padding: 10px;
  border-left: 1px solid #ffffff40;
}

.iss-public-stat:first-child {
  border-left: 0;
}

.iss-public-stat strong,
.iss-public-stat span {
  display: block;
}

.iss-public-stat strong {
  font-size: clamp(19px, 2.4vw, 28px);
}

.iss-public-stat span {
  font-size: 10px;
  margin-top: 8px;
  opacity: 0.92;
}

.iss-stats-note {
  grid-column: 1 / -1;
  font-size: 9px;
  opacity: 0.85;
}

.iss-demo-section {
  padding: 70px 7.5%;
  display: grid;
  grid-template-columns: 0.45fr 1fr 1fr;
  align-items: center;
  gap: 32px;
  background: #f1f8ff;
  margin-top: 55px;
}

.iss-demo-icon {
  display: grid;
  place-items: center;
  min-height: 145px;
  border: 1px solid #d6e9ff;
  border-radius: 18px;
  background: linear-gradient(145deg, #dceeff, #fff);
  font-size: 65px;
}

.iss-demo-copy h2 {
  font-size: 25px;
}

.iss-demo-copy > p {
  font-size: 12px;
}

.iss-demo-info {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  padding: 23px;
  background: #fff;
  border: 1px solid #dfebf9;
  border-radius: 14px;
}

.iss-demo-info-icon {
  display: grid;
  place-items: center;
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  color: var(--iss-blue);
  background: #eaf3ff;
  border-radius: 50%;
}

.iss-demo-info strong {
  font-size: 12px;
}

.iss-demo-info p {
  font-size: 10px;
  color: #526782;
  line-height: 1.8;
}

.iss-demo-info small {
  display: block;
  font-size: 9px;
  color: #7889a0;
  line-height: 1.7;
}

.iss-cta-section {
  margin: 60px 7.5%;
  padding: 55px 20px;
  text-align: center;
  border: 1px solid #e3edfa;
  border-radius: 20px;
  background: linear-gradient(135deg, #f0f7ff, #fff);
}

.iss-cta-section h2 {
  max-width: 620px;
  margin: 17px auto 12px;
  font-size: clamp(25px, 3.5vw, 36px);
  letter-spacing: -1px;
  line-height: 1.3;
}

.iss-cta-section p {
  color: var(--iss-text);
  font-size: 13px;
  line-height: 1.8;
  margin-bottom: 24px;
}

.iss-btn-light {
  color: #fff;
  background: var(--iss-blue);
}

.iss-footer {
  padding: 35px 7.5% 20px;
  color: #fff;
  background: #12294b;
}

.iss-footer-brand strong {
  color: #fff;
}

.iss-footer-brand small {
  color: #b8c9df;
}

.iss-footer-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 25px;
  flex-wrap: wrap;
}

.iss-footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
}

.iss-footer-links a {
  color: #c9d7e9;
  font-size: 10px;
}

.iss-footer-links a:hover {
  color: #fff;
}

.iss-footer-bottom {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1px solid #ffffff20;
  color: #b8c9df;
  font-size: 10px;
}

@media (min-width: 1500px) {
  .iss-landing {
    max-width: 1800px;
    margin: 0 auto;
  }
}

@media (max-width: 1050px) {
  .iss-header {
    padding-left: 4%;
    padding-right: 4%;
  }

  .iss-nav {
    gap: 14px;
  }

  .iss-hero,
  .section-wrap,
  .iss-demo-section {
    padding-left: 5%;
    padding-right: 5%;
  }

  .iss-hero {
    gap: 25px;
  }

  .iss-dashboard {
    grid-template-columns: 115px minmax(0, 1fr);
  }

  .iss-dashboard-sidebar {
    font-size: 9px;
  }

  .iss-features {
    grid-template-columns: 0.65fr 1.5fr;
    gap: 28px;
  }

  .iss-feature-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .iss-demo-section {
    grid-template-columns: 0.4fr 1fr;
  }

  .iss-demo-info {
    grid-column: 2;
  }
}

@media (max-width: 720px) {
  .iss-header {
    padding: 15px 5%;
    flex-wrap: wrap;
    gap: 15px;
  }

  .iss-brand strong {
    font-size: 14px;
  }

  .iss-brand small {
    font-size: 9px;
  }

  .iss-brand-icon {
    font-size: 30px;
  }

  .iss-nav {
    order: 3;
    width: 100%;
    overflow-x: auto;
    gap: 22px;
    padding-bottom: 2px;
  }

  .iss-nav a {
    flex-shrink: 0;
    font-size: 11px;
  }

  .iss-header-actions {
    margin-left: auto;
    gap: 7px;
  }

  .iss-btn {
    padding: 11px 13px;
    min-height: 40px;
    font-size: 11px;
  }

  .iss-hero {
    grid-template-columns: 1fr;
    padding: 53px 5% 55px;
    gap: 40px;
  }

  .iss-hero h1 {
    font-size: clamp(35px, 9vw, 48px);
    letter-spacing: -1.5px;
  }

  .iss-hero-description {
    font-size: 13px;
  }

  .iss-trust-points {
    gap: 12px;
    font-size: 9px;
  }

  .iss-hero-visual {
    padding: 10px 0 20px;
  }

  .iss-dashboard {
    grid-template-columns: 100px minmax(0, 1fr);
    min-height: 280px;
    transform: none;
  }

  .iss-dashboard-sidebar {
    padding: 13px 7px;
    gap: 7px;
    font-size: 8px;
  }

  .iss-dashboard-sidebar strong {
    font-size: 10px;
  }

  .iss-dashboard-sidebar span {
    padding: 7px 5px;
  }

  .iss-dashboard-main {
    padding: 12px 9px;
  }

  .iss-dashboard-main h3 {
    font-size: 14px;
    margin: 14px 0 10px;
  }

  .iss-stat-card {
    padding: 9px;
  }

  .iss-stat-card strong {
    font-size: 19px;
  }

  .iss-dashboard-bottom {
    gap: 6px;
  }

  .iss-activity-card,
  .iss-chart-card {
    padding: 8px 6px;
  }

  .iss-activity-card p {
    font-size: 7px;
  }

  .iss-floating-note {
    left: -4px;
    bottom: -6px;
    padding: 10px;
  }

  .section-wrap {
    padding: 55px 5%;
  }

  .iss-features {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .iss-section-heading h2 {
    max-width: 450px;
    font-size: 30px;
  }

  .iss-feature-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 27px 18px;
  }

  .iss-stats-band {
    margin: 0 4%;
    padding: 28px 18px;
    grid-template-columns: 1fr;
    gap: 24px;
    border-radius: 16px;
  }

  .iss-stats-intro h2 {
    font-size: 22px;
  }

  .iss-public-stat {
    padding: 10px 5px;
  }

  .iss-public-stat strong {
    font-size: 20px;
  }

  .iss-public-stat span {
    font-size: 9px;
  }

  .iss-demo-section {
    padding: 45px 5%;
    margin-top: 35px;
    grid-template-columns: 1fr;
    gap: 22px;
  }

  .iss-demo-icon {
    min-height: 110px;
    font-size: 50px;
  }

  .iss-demo-info {
    grid-column: auto;
  }

  .iss-cta-section {
    margin: 35px 5%;
    padding: 40px 18px;
  }

  .iss-cta-section h2 {
    font-size: 27px;
  }

  .iss-footer {
    padding: 30px 5% 18px;
  }

  .iss-footer-main {
    align-items: flex-start;
    flex-direction: column;
  }

  .iss-footer-links {
    gap: 17px;
  }
}

@media (max-width: 380px) {
  .iss-header-actions .iss-small-btn {
    padding: 10px;
  }

  .iss-dashboard {
    grid-template-columns: 80px minmax(0, 1fr);
  }

  .iss-dashboard-sidebar {
    font-size: 7px;
  }

  .iss-stat-card small {
    font-size: 8px;
  }

  .iss-feature-grid {
    gap: 23px 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .iss-landing *,
  .iss-landing *::before,
  .iss-landing *::after {
    scroll-behavior: auto !important;
    transition: none !important;
  }
}