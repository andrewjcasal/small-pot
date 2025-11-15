import { Sparkles, Gift, Home, TreePine, Snowflake, Heart } from 'lucide-react';
import './Gallery.css';

export default function Gallery() {
  return (
    <div className="gallery">
      <section className="gallery-hero">
        <h1>Gallery</h1>
        <p className="subtitle">A collection of handcrafted stained glass works</p>
      </section>

      <section className="gallery-content">
        <div className="gallery-section">
          <h2>
            <Gift className="section-icon" />
            Seasonal Ornaments
          </h2>
          <div className="gallery-grid">
            <div className="gallery-item">
              <div className="image-placeholder">
                <Home className="icon" />
              </div>
              <div className="item-info">
                <h4>House</h4>
                <p>Charming home design perfect for year-round display</p>
              </div>
            </div>

            <div className="gallery-item">
              <div className="image-placeholder">
                <TreePine className="icon" />
              </div>
              <div className="item-info">
                <h4>Tree</h4>
                <p>Evergreen tree ornament celebrating nature's beauty</p>
              </div>
            </div>

            <div className="gallery-item">
              <div className="image-placeholder">
                <Snowflake className="icon" />
              </div>
              <div className="item-info">
                <h4>Snowflake</h4>
                <p>Delicate winter snowflake with intricate detail</p>
              </div>
            </div>

            <div className="gallery-item">
              <div className="image-placeholder">
                <Sparkles className="icon" />
              </div>
              <div className="item-info">
                <h4>Angels</h4>
                <p>Elegant angel designs for holiday decorating</p>
              </div>
            </div>
          </div>
        </div>

        <div className="gallery-section">
          <h2>
            <Heart className="section-icon" />
            Recent Work
          </h2>
          <div className="gallery-grid">
            <div className="gallery-item">
              <div className="image-placeholder">
                <Sparkles className="icon" />
              </div>
              <div className="item-info">
                <h4>Strawberries</h4>
                <p>Fresh and vibrant fruit design</p>
              </div>
            </div>

            <div className="gallery-item">
              <div className="image-placeholder">
                <Heart className="icon" />
              </div>
              <div className="item-info">
                <h4>Claddagh</h4>
                <p>Traditional Irish symbol of love and friendship</p>
              </div>
            </div>

            <div className="gallery-item">
              <div className="image-placeholder">
                <Heart className="icon" />
              </div>
              <div className="item-info">
                <h4>Hearts</h4>
                <p>Classic heart designs in rich, warm colors</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
