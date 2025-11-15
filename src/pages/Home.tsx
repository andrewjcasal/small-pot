import { Sparkles, Palette, GraduationCap, Apple } from 'lucide-react';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-background"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Small Pot Herbal Care</h1>
          <p className="tagline">Artisan Stained Glass Studio</p>
          <p className="artist-name">Lisa Stephen</p>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <Sparkles className="feature-icon" />
          <h3>Holiday Collection</h3>
          <p>Festive stained glass pieces perfect for seasonal decorating and gift-giving</p>
        </div>
        <div className="feature-card">
          <Palette className="feature-icon" />
          <h3>Gallery</h3>
          <p>Explore our collection of unique handcrafted stained glass artwork and commissions</p>
        </div>
        <div className="feature-card">
          <GraduationCap className="feature-icon" />
          <h3>Classes & Workshops</h3>
          <p>Learn the art of stained glass in hands-on classes for all skill levels</p>
        </div>
      </section>

      <section className="showcase">
        <h2>Featured Work</h2>
        <div className="showcase-grid">
          <div className="showcase-item">
            <div className="image-placeholder">
              <Sparkles className="icon" />
            </div>
            <h4>Winter Solstice</h4>
          </div>
          <div className="showcase-item">
            <div className="image-placeholder">
              <Palette className="icon" />
            </div>
            <h4>Traditions</h4>
          </div>
          <div className="showcase-item">
            <div className="image-placeholder">
              <Apple className="icon" />
            </div>
            <h4>Cornucopia</h4>
          </div>
        </div>
      </section>
    </div>
  );
}
