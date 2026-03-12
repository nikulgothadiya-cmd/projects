import "./pages.css";

export default function AboutUs() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="hero-overlay" />
        <div className="hero-text">
          <h1>About BookStore</h1>
          <p>Your favorite place for great books</p>
        </div>
      </section>

      <section className="about-content">
        <h2>Our Story</h2>
        <p>
          Welcome to <strong>BookStore</strong>! We're passionate about bringing readers
          and books together. Our platform offers a curated selection of titles ranging
          from classic literature to modern bestsellers.
        </p>
        <p>
          Founded in 2023, our mission is to make reading accessible and enjoyable
          for everyone. Whether you're searching for your next great read or 
          exploring new genres, we're here to help you discover books that inspire.
        </p>
      </section>

      <section className="values-section">
        <h2>Our Values</h2>
        <div className="values-cards">
          <div className="value-card">
            <div className="value-icon">📚</div>
            <h3>Quality</h3>
            <p>Curated selection of the finest books</p>
          </div>
          <div className="value-card">
            <div className="value-icon">❤️</div>
            <h3>Passion</h3>
            <p>We love books and love sharing them</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🌍</div>
            <h3>Accessibility</h3>
            <p>Making reading available to everyone</p>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat">
          <h3>10K+</h3>
          <p>Books Available</p>
        </div>
        <div className="stat">
          <h3>50K+</h3>
          <p>Happy Readers</p>
        </div>
        <div className="stat">
          <h3>100%</h3>
          <p>Satisfaction</p>
        </div>
      </section>

      <section className="team-section">
        <h2>Meet the Team</h2>
        <div className="team-cards">
          <div className="team-card">
            <img src="./public/founder.jpg" alt="Founder" />
            <h3>Nikul Gothadiya</h3>
            <p>Founder &amp; CEO</p>
          </div>
          <div className="team-card">
            <img src="./public/founder.jpg" alt="Developer" />
            <h3>Nikul Gothadiya</h3>
            <p>Lead Developer</p>
          </div>
          <div className="team-card">
            <img src="./public/founder.jpg" alt="Designer" />
            <h3>Nikul Gothadiya</h3>
            <p>UI/UX Designer</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Start Your Reading Journey</h2>
        <p>Explore thousands of books and find your next favorite read today!</p>
        <a href="/" className="cta-button">Browse Books</a>
      </section>
    </div>
  );
}
