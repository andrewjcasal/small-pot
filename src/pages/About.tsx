import { User } from 'lucide-react';
import './About.css';

export default function About() {
  return (
    <div className="about">
      <section className="about-hero">
        <h1>About Small Pot</h1>
        <p className="subtitle">Crafting light and color through traditional stained glass techniques</p>
      </section>

      <section className="about-content">
        <div className="about-image-placeholder">
          <User className="icon" />
        </div>

        <div className="about-text">
          <h2>The Artist</h2>
          <p>
            Welcome to Small Pot Herbal Care, where the ancient art of stained glass meets
            contemporary design. Each piece is meticulously handcrafted in our studio, combining
            traditional techniques with modern aesthetics.
          </p>
          <p>
            What began as a passion for botanical illustrations and herbal traditions has evolved
            into a dedicated stained glass practice. Every window, panel, and ornament tells a
            story through color, light, and craftsmanship.
          </p>

          <h2>The Craft</h2>
          <p>
            Using time-honored copper foil and lead came methods, each piece is carefully designed,
            cut, and assembled by hand. From selecting the perfect glass to the final polish,
            every step receives meticulous attention to detail.
          </p>
          <p>
            Our work ranges from delicate holiday ornaments to large-scale architectural installations,
            with a special focus on botanical themes and seasonal collections.
          </p>

          <h2>Teaching & Community</h2>
          <p>
            Sharing the joy of stained glass is an essential part of our mission. We offer regular
            workshops and classes for students of all skill levels, from curious beginners to
            experienced artisans looking to refine their technique.
          </p>
        </div>
      </section>
    </div>
  );
}
