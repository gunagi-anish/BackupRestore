import { Link } from "react-router-dom";

const features = [
  {
    title: "Secure",
    text: "End-to-end encryption keeps your data safe.",
    icon: "shield",
  },
  {
    title: "Reliable",
    text: "Automatic backups and version history you can trust.",
    icon: "cloud",
  },
  {
    title: "Easy Recovery",
    text: "Restore your files anytime, anywhere.",
    icon: "sync",
  },
];

function FeatureIcon({ icon }) {
  if (icon === "shield") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2 4.5 5.2v6.4c0 4.8 3.2 9.2 7.5 10.8 4.3-1.6 7.5-6 7.5-10.8V5.2L12 2Zm0 2.3 5.5 2.4v4.9c0 3.8-2.3 7.4-5.5 8.9-3.2-1.5-5.5-5.1-5.5-8.9V6.7L12 4.3Z" />
      </svg>
    );
  }

  if (icon === "cloud") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.2 19.5h10.1c2.7 0 4.7-1.9 4.7-4.3 0-2.4-2-4.3-4.7-4.3h-.5A6.1 6.1 0 0 0 11 5.7a6 6 0 0 0-5.9 5.1h-.2C2.8 10.8 1 12.3 1 14.4c0 2.8 2.3 5.1 5.2 5.1Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3a9 9 0 0 0-8.9 8H1l3.3 3.3.1.2L7.8 11H5.5a6.5 6.5 0 0 1 11.2-3.7l1.8-1.8A8.9 8.9 0 0 0 12 3Zm10.8 6.5-3.3-3.3-.1-.2-3.4 3.5h2.3a6.5 6.5 0 0 1-11.2 3.7l-1.8 1.8A9 9 0 0 0 20.9 13H23l-.2-3.5Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="home-page">
      <header className="home-nav">
        <div className="home-brand">
          <span className="home-brand-logo" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 2 4.5 5.2v6.4c0 4.8 3.2 9.2 7.5 10.8 4.3-1.6 7.5-6 7.5-10.8V5.2L12 2Zm0 2.3 5.5 2.4v4.9c0 3.8-2.3 7.4-5.5 8.9-3.2-1.5-5.5-5.1-5.5-8.9V6.7L12 4.3Z" />
            </svg>
          </span>
          <span>Secure Backup</span>
        </div>

        <nav className="home-links">
          <a href="#">Home</a>
          <a href="#">Features</a>
          <a href="#">How It Works</a>
          <a href="#">About</a>
        </nav>

        <div className="home-actions">
          <Link to="/login" className="btn btn-outline-light px-4">
            Login
          </Link>
          <Link to="/register" className="btn home-primary-btn px-4">
            Get Started
          </Link>
        </div>
      </header>

      <section className="home-hero">
        <div className="home-hero-content">
          <h1>
            Secure Your Data.
            <br />
            Backup Today,
            <br />
            <span>Restore Anytime.</span>
          </h1>
          <p>
            Our secure backup and recovery system ensures your important files are always safe and just
            a click away.
          </p>
          <div className="home-hero-buttons">
            <Link to="/register" className="btn home-primary-btn btn-lg px-4">
              Get Started
            </Link>
            <a href="#" className="btn btn-outline-light btn-lg px-4">
              Learn More
            </a>
          </div>
        </div>

        <div className="home-hero-visual" aria-hidden="true">
          <div className="hero-cloud">
            <span className="hero-arrow">↑</span>
          </div>
          <div className="hero-shield">
            <svg viewBox="0 0 24 24">
              <path d="M12 2 4.5 5.2v6.4c0 4.8 3.2 9.2 7.5 10.8 4.3-1.6 7.5-6 7.5-10.8V5.2L12 2Zm0 2.3 5.5 2.4v4.9c0 3.8-2.3 7.4-5.5 8.9-3.2-1.5-5.5-5.1-5.5-8.9V6.7L12 4.3Z" />
            </svg>
          </div>
          <div className="hero-box hero-box-left" />
          <div className="hero-box hero-box-right" />
        </div>
      </section>

      <section className="home-features">
        {features.map((feature) => (
          <article key={feature.title} className="home-feature-card">
            <span className="home-feature-icon">
              <FeatureIcon icon={feature.icon} />
            </span>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
