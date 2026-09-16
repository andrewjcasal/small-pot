import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Paintbrush, Wrench, Heart, Star } from 'lucide-react';
import './Links.css';

type LinkItem =
  | {
      kind: 'link';
      label: string;
      url: string;
      icon: React.ReactNode;
      isExternal: boolean;
    }
  | { kind: 'classes'; label: string; icon: React.ReactNode };

interface ClassLocation {
  label: string;
  url: string;
}

const classLocations: ClassLocation[] = [
  { label: 'Bedford', url: 'https://members.bowercenter.org/classes/Search?term=stained+glass' },
  {
    label: 'Lynchburg',
    url: 'https://valynchburgweb.myvscloud.com/webtrac/web/search.html?Action=Start&SubAction=&_csrf_token=UT0V1B0R0G6U282X3C342L3H5R4U4Y54045O615756726U4I6N4V194O646Q4S1C5N5Z5D69026T5P6D55726Y3U6Q51185Q4L6O58165Q5S544S075J5V5M58085H4K5B&primarycode=23620&keyword=&subtype=&location=&spotsavailable=&endmonth=&age=&grade=&registrationevent=&keywordoption=Match+One&instructor=&daysofweek=&dayoption=All&timeblock=&gender=&bydayonly=No&beginyear=&season=&showwithavailable=No&display=Detail&module=AR&multiselectlist_value=&arwebsearch_buttonsearch=yes',
  },
  { label: 'Powhatan', url: 'https://wmcacc.org/classes-events' },
];

const links: LinkItem[] = [
  {
    kind: 'classes',
    label: 'take a class with me',
    icon: <Paintbrush className="link-icon" />,
  },
  {
    kind: 'link',
    label: 'inspirational glass artists',
    url: '/artists',
    icon: <Star className="link-icon" />,
    isExternal: false,
  },
  {
    kind: 'link',
    label: 'tools & materials',
    url: '/tools',
    icon: <Wrench className="link-icon" />,
    isExternal: false,
  },
  {
    kind: 'link',
    label: 'custom orders',
    url: '/custom-orders',
    icon: <Heart className="link-icon" />,
    isExternal: false,
  },
  {
    kind: 'link',
    label: 'tiktok',
    url: 'https://www.tiktok.com/@shopsmallpot',
    // Lucide has no TikTok mark. This is an icons8 one, pre-tinted to
    // --color-text and scaled so the glyph covers 92% of its box, matching
    // Lucide's instagram beside it.
    icon: <img src="/icons/tiktok-link.webp" alt="" className="link-icon" />,
    isExternal: true,
  },
  {
    kind: 'link',
    label: 'instagram',
    url: 'https://www.instagram.com/shopsmallpot',
    icon: <Instagram className="link-icon" />,
    isExternal: true,
  },
];

export default function Links() {
  const [showLocations, setShowLocations] = useState(false);

  return (
    <div className="links-page">
      <div className="links-container">
        <div className="links-header">
          <img src="/logo.png" alt="small pot logo" className="links-logo" />
          <h1>small pot</h1>
          <p className="links-tagline">stained glass handcrafted in virginia</p>
        </div>

        <div className="links-list">
          {links.map((link, index) => {
            if (link.kind === 'classes') {
              if (!showLocations) {
                return (
                  <button
                    key={index}
                    type="button"
                    className="link-button"
                    onClick={() => setShowLocations(true)}
                    aria-expanded={false}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </button>
                );
              }

              return (
                <div key={index} className="class-locations">
                  {classLocations.map(({ label, url }) => (
                    <a
                      key={label}
                      href={url}
                      className="link-button class-location"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>{label}</span>
                    </a>
                  ))}
                </div>
              );
            }

            return link.isExternal ? (
              <a
                key={index}
                href={link.url}
                className="link-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.icon}
                <span>{link.label}</span>
              </a>
            ) : (
              <Link key={index} to={link.url} className="link-button">
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
