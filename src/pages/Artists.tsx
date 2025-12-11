import { Youtube, Instagram, ExternalLink } from 'lucide-react';
import './Artists.css';

interface Artist {
  name: string;
  blurb: string;
  youtube?: string;
  instagram?: string;
  website?: string;
}

const artists: Artist[] = [
  {
    name: 'Artist Name 1',
    blurb: 'A talented stained glass artist known for intricate floral designs and vibrant color palettes.',
    youtube: 'https://youtube.com/@example1',
    instagram: 'https://instagram.com/example1',
  },
  {
    name: 'Artist Name 2',
    blurb: 'Contemporary glass artist specializing in geometric patterns and modern interpretations of traditional techniques.',
    youtube: 'https://youtube.com/@example2',
    instagram: 'https://instagram.com/example2',
  },
  {
    name: 'Artist Name 3',
    blurb: 'Master craftsperson creating stunning architectural glass installations and restoration work.',
    instagram: 'https://instagram.com/example3',
    website: 'https://example.com',
  },
];

export default function Artists() {
  return (
    <div className="artists">
      <section className="artists-hero">
        <h1>Artists to Watch</h1>
        <p className="subtitle">Talented creators inspiring the stained glass community</p>
      </section>

      <section className="artists-content">
        <div className="artists-list">
          {artists.map((artist, index) => (
            <div key={index} className="artist-card">
              <h3>{artist.name}</h3>
              <p>{artist.blurb}</p>
              <div className="artist-links">
                {artist.youtube && (
                  <a href={artist.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <Youtube className="artist-link-icon" />
                  </a>
                )}
                {artist.instagram && (
                  <a href={artist.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <Instagram className="artist-link-icon" />
                  </a>
                )}
                {artist.website && (
                  <a href={artist.website} target="_blank" rel="noopener noreferrer" aria-label="Website">
                    <ExternalLink className="artist-link-icon" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
