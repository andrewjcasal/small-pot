import { useState } from 'react';
import type { SocialKey } from '../data/artists';
import { iconSrc, socialLabels } from '../data/artists';
import './SocialIcon.css';

interface Props {
  kind: SocialKey;
  href: string;
  artistName: string;
}

export default function SocialIcon({ kind, href, artistName }: Props) {
  const [active, setActive] = useState(false);

  return (
    <a
      href={href}
      className="social-icon"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${artistName} on ${socialLabels[kind]}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <img src={iconSrc(kind, active)} alt="" aria-hidden="true" draggable={false} />
    </a>
  );
}
