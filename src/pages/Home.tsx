import { useState } from 'react';
import { User, Sparkles, Palette, Apple, FileEdit, CheckCircle } from 'lucide-react';
import './Home.css';

export default function Home() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString(),
    })
      .then(() => setFormSubmitted(true))
      .catch((error) => console.error('Form submission error:', error));
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Small Pot</h1>
          <p className="tagline">Stained Glass Studio</p>
          <p className="artist-name">Lisa Stephen</p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-container">
          <div className="about-image">
            <div className="image-placeholder">
              <User className="icon" />
            </div>
          </div>
          <div className="about-text">
            <h2>The Artist</h2>
            <p>
              Welcome to Small Pot, where the ancient art of stained glass meets
              contemporary design. Each piece is meticulously handcrafted in our studio,
              combining traditional techniques with modern aesthetics.
            </p>
            <p>
              What began as a passion for botanical illustrations and herbal traditions
              has evolved into a dedicated stained glass practice. Every window, panel,
              and ornament tells a story through color, light, and craftsmanship.
            </p>
            <h2>The Craft</h2>
            <p>
              Using time-honored copper foil and lead came methods, each piece is carefully
              designed, cut, and assembled by hand. From selecting the perfect glass to the
              final polish, every step receives meticulous attention to detail.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="gallery-section">
        <h2>Gallery Wall <span className="in-progress">(In Progress)</span></h2>
        <div className="gallery-grid">
          <div className="gallery-item">
            <div className="image-placeholder">
              <Sparkles className="icon" />
            </div>
            <h4>Winter Solstice</h4>
          </div>
          <div className="gallery-item">
            <div className="image-placeholder">
              <Palette className="icon" />
            </div>
            <h4>Traditions</h4>
          </div>
          <div className="gallery-item">
            <div className="image-placeholder">
              <Apple className="icon" />
            </div>
            <h4>Cornucopia</h4>
          </div>
        </div>
      </section>

      {/* Custom Request Form Section */}
      <section id="request" className="request-section">
        <h2>Custom Request</h2>
        <p className="section-intro">Let's create something beautiful together</p>

        {formSubmitted ? (
          <div className="success-message">
            <CheckCircle className="success-icon" />
            <h3>Thank You!</h3>
            <p>Your request has been submitted. I'll be in touch soon to discuss your project.</p>
          </div>
        ) : (
          <>
            <div className="form-intro">
              <FileEdit className="form-intro-icon" />
              <p>Fill out the form below to tell me about your custom stained glass project. I'll get back to you within a few days.</p>
            </div>

            <form
              name="custom-request"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              className="request-form"
            >
              <input type="hidden" name="form-name" value="custom-request" />
              <p className="hidden">
                <label>
                  Don't fill this out: <input name="bot-field" />
                </label>
              </p>

              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Your name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="(555) 555-5555"
                  />
                </div>
              </div>
              <p className="form-hint">Please provide at least one contact method.</p>

              <div className="form-group">
                <label htmlFor="description">Project Description *</label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  placeholder="Tell me about your vision - size, colors, design ideas, where it will be displayed..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="delivery-date">Preferred Delivery Date</label>
                <input
                  type="text"
                  id="delivery-date"
                  name="delivery-date"
                  placeholder="e.g., Before December 2024, No rush, etc."
                />
              </div>

              <div className="form-group">
                <label htmlFor="referral">How did you hear about me?</label>
                <input
                  type="text"
                  id="referral"
                  name="referral"
                  placeholder="Instagram, friend, class, etc."
                />
              </div>

              <button type="submit" className="submit-button">
                Submit Request
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
