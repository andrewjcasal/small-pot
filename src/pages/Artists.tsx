import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  artists,
  socialOrder,
  preloadAnimatedIcons,
  type Artist,
} from '../data/artists';
import SocialIcon from '../components/SocialIcon';
import './Artists.css';

function ArtistCard({ artist }: { artist: Artist }) {
  const primaryUrl = artist.socials[artist.primary];
  const icons = socialOrder.filter((key) => artist.socials[key]);

  const photo = artist.slug ? (
    <>
      <img
        className={artist.logoBleed ? 'artist-logo is-bleed' : 'artist-logo'}
        src={`/artists/${artist.slug}-logo.webp`}
        alt={`${artist.name} logo`}
        loading="lazy"
      />
      <img
        className="artist-sample"
        src={`/artists/${artist.slug}-sample.webp`}
        alt={`Stained glass by ${artist.name}`}
        loading="lazy"
      />
    </>
  ) : (
    <span className="artist-initials" aria-hidden="true">
      {artist.name
        .split(' ')
        .map((word) => word[0])
        .join('')}
    </span>
  );

  return (
    <div className="artist-card">
      {primaryUrl ? (
        <a
          className="artist-photo"
          href={primaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={artist.name}
        >
          {photo}
        </a>
      ) : (
        <div className="artist-photo">{photo}</div>
      )}

      <h2 className="artist-name">{artist.name}</h2>

      <div className="artist-socials">
        {icons.map((key) => (
          <SocialIcon
            key={key}
            kind={key}
            href={artist.socials[key]!}
            artistName={artist.name}
          />
        ))}
      </div>
    </div>
  );
}

export default function Artists() {
  useEffect(() => {
    preloadAnimatedIcons(socialOrder);
  }, []);

  return (
    <div className="artists-page">
      <div className="artists-container">
        <header className="artists-header">
          <Link to="/links" className="artists-back">
            <ArrowLeft className="artists-back-icon" />
            <span>back</span>
          </Link>
          <h1>inspirational glass artists</h1>
          <p className="artists-tagline">follow to learn techniques and tricks</p>
        </header>

        <div className="artists-grid">
          {artists.map((artist) => (
            <ArtistCard key={artist.name} artist={artist} />
          ))}
        </div>
      </div>
    </div>
  );
}
