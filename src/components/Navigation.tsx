import { Link, useLocation } from 'react-router-dom';
import { Home, User, Image, GraduationCap, Mail, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Navigation.css';

export default function Navigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-name">Small Pot Herbal Care</span>
          <span className="brand-tagline">Stained Glass Studio</span>
        </Link>

        <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className={`nav-links ${isMenuOpen ? 'mobile-open' : ''}`}>
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''} onClick={closeMenu}>
              <Home className="nav-icon" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/about" className={isActive('/about') ? 'active' : ''} onClick={closeMenu}>
              <User className="nav-icon" />
              <span>About</span>
            </Link>
          </li>
          <li>
            <Link to="/gallery" className={isActive('/gallery') ? 'active' : ''} onClick={closeMenu}>
              <Image className="nav-icon" />
              <span>Gallery</span>
            </Link>
          </li>
          <li>
            <Link to="/classes" className={isActive('/classes') ? 'active' : ''} onClick={closeMenu}>
              <GraduationCap className="nav-icon" />
              <span>Classes</span>
            </Link>
          </li>
          <li>
            <Link to="/contact" className={isActive('/contact') ? 'active' : ''} onClick={closeMenu}>
              <Mail className="nav-icon" />
              <span>Contact</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
