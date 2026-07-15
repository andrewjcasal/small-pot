import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  creators,
  socialOrder,
  preloadAnimatedIcons,
  type Creator,
} from '../data/creators';
import SocialIcon from '../components/SocialIcon';
import './Creators.css';

function CreatorCard({ creator }: { creator: Creator }) {
  const primaryUrl = creator.socials[creator.primary];
  const icons = socialOrder.filter((key) => creator.socials[key]);

  const photo = creator.slug ? (
    <>
      <img
        className="creator-logo"
        src={`/creators/${creator.slug}-logo.webp`}
        alt={`${creator.name} logo`}
        loading="lazy"
      />
      <img
        className="creator-sample"
        src={`/creators/${creator.slug}-sample.webp`}
        alt={`Stained glass by ${creator.name}`}
        loading="lazy"
      />
    </>
  ) : (
    <span className="creator-initials" aria-hidden="true">
      {creator.name
        .split(' ')
        .map((word) => word[0])
        .join('')}
    </span>
  );

  return (
    <div className="creator-card">
      {primaryUrl ? (
        <a
          className="creator-photo"
          href={primaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={creator.name}
        >
          {photo}
        </a>
      ) : (
        <div className="creator-photo">{photo}</div>
      )}

      <h2 className="creator-name">{creator.name}</h2>

      <div className="creator-socials">
        {icons.map((key) => (
          <SocialIcon
            key={key}
            kind={key}
            href={creator.socials[key]!}
            creatorName={creator.name}
          />
        ))}
      </div>
    </div>
  );
}

export default function Creators() {
  useEffect(() => {
    preloadAnimatedIcons(socialOrder);
  }, []);

  return (
    <div className="creators-page">
      <div className="creators-container">
        <header className="creators-header">
          <Link to="/links" className="creators-back">
            <ArrowLeft className="creators-back-icon" />
            <span>back</span>
          </Link>
          <h1>inspirational glass artists</h1>
          <p className="creators-tagline">stained glass artists worth following</p>
        </header>

        <div className="creators-grid">
          {creators.map((creator) => (
            <CreatorCard key={creator.name} creator={creator} />
          ))}
        </div>
      </div>
    </div>
  );
}
