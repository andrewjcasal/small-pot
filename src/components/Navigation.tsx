import { Link, useLocation } from 'react-router-dom';
import { Home, User, Image, GraduationCap, Mail } from 'lucide-react';
import './Navigation.css';

export default function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-name">Small Pot Herbal Care</span>
          <span className="brand-tagline">Stained Glass Studio</span>
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              <Home className="nav-icon" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/about" className={isActive('/about') ? 'active' : ''}>
              <User className="nav-icon" />
              <span>About</span>
            </Link>
          </li>
          <li>
            <Link to="/gallery" className={isActive('/gallery') ? 'active' : ''}>
              <Image className="nav-icon" />
              <span>Gallery</span>
            </Link>
          </li>
          <li>
            <Link to="/classes" className={isActive('/classes') ? 'active' : ''}>
              <GraduationCap className="nav-icon" />
              <span>Classes</span>
            </Link>
          </li>
          <li>
            <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>
              <Mail className="nav-icon" />
              <span>Contact</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
