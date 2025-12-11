import { Link } from 'react-router-dom';
import { Instagram, GraduationCap, ShoppingBag, Users, FileEdit } from 'lucide-react';
import './Links.css';

interface LinkItem {
  label: string;
  url: string;
  icon: React.ReactNode;
  isExternal: boolean;
}

const links: LinkItem[] = [
  {
    label: 'Instagram',
    url: 'https://www.instagram.com/shopsmallpot',
    icon: <Instagram className="link-icon" />,
    isExternal: true,
  },
  {
    label: 'Take a Class With Me',
    url: 'https://valynchburgweb.myvscloud.com/webtrac/web/search.html?Action=Start&SubAction=&_csrf_token=Pq0W736Y0G6V3R2Q1B3E2L4R5S604V54085N4L5O6H165T5P5Y6D734R4P5B4J0B724Q6L5J065I4Q6G5S045E3I6N6K6S5V4S6O550J5W4G5D4X6J005S4A6J04584Q5B&keyword=&subtype=Stained+Glass&primarycode=&spotsavailable=&beginmonth=&endmonth=&age=&grade=&registrationevent=&keywordoption=Match+One&instructor=&daysofweek=&dayoption=All&timeblock=&gender=&bydayonly=No&beginyear=&season=&showwithavailable=No&display=Detail&module=AR&multiselectlist_value=&arwebsearch_buttonsearch=yes',
    icon: <GraduationCap className="link-icon" />,
    isExternal: true,
  },
  {
    label: 'Beginner Kit',
    url: 'https://www.amazon.com/hz/wishlist/ls/33G07IIHZPN4T?ref_=wl_share',
    icon: <ShoppingBag className="link-icon" />,
    isExternal: true,
  },
  {
    label: 'Artists to Watch',
    url: '/artists',
    icon: <Users className="link-icon" />,
    isExternal: false,
  },
  {
    label: 'Custom Request Form',
    url: '/#request',
    icon: <FileEdit className="link-icon" />,
    isExternal: false,
  },
];

export default function Links() {
  return (
    <div className="links-page">
      <div className="links-container">
        <div className="links-header">
          <h1>Small Pot</h1>
          <p className="links-tagline">Stained Glass Studio</p>
        </div>

        <div className="links-list">
          {links.map((link, index) =>
            link.isExternal ? (
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
            )
          )}
        </div>
      </div>
    </div>
  );
}
