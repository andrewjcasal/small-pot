import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Paintbrush, ShoppingBag, Heart, Users } from 'lucide-react';
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
  { label: 'Bedford', url: 'https://members.bowercenter.org/classes' },
  {
    label: 'Lynchburg',
    url: 'https://valynchburgweb.myvscloud.com/webtrac/web/search.html?Action=Start&SubAction=&_csrf_token=Pq0W736Y0G6V3R2Q1B3E2L4R5S604V54085N4L5O6H165T5P5Y6D734R4P5B4J0B724Q6L5J065I4Q6G5S045E3I6N6K6S5V4S6O550J5W4G5D4X6J005S4A6J04584Q5B&keyword=&subtype=Stained+Glass&primarycode=&spotsavailable=&beginmonth=&endmonth=&age=&grade=&registrationevent=&keywordoption=Match+One&instructor=&daysofweek=&dayoption=All&timeblock=&gender=&bydayonly=No&beginyear=&season=&showwithavailable=No&display=Detail&module=AR&multiselectlist_value=&arwebsearch_buttonsearch=yes',
  },
];

const links: LinkItem[] = [
  {
    kind: 'link',
    label: 'instagram',
    url: 'https://www.instagram.com/shopsmallpot',
    icon: <Instagram className="link-icon" />,
    isExternal: true,
  },
  {
    kind: 'classes',
    label: 'take a class with me',
    icon: <Paintbrush className="link-icon" />,
  },
  {
    kind: 'link',
    label: 'inspirational glass artists',
    url: '/creators',
    icon: <Users className="link-icon" />,
    isExternal: false,
  },
  {
    kind: 'link',
    label: 'beginner kit',
    url: 'https://www.amazon.com/hz/wishlist/ls/33G07IIHZPN4T?ref_=wl_share',
    icon: <ShoppingBag className="link-icon" />,
    isExternal: true,
  },
  {
    kind: 'link',
    label: 'custom orders',
    url: '/custom-orders',
    icon: <Heart className="link-icon" />,
    isExternal: false,
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
