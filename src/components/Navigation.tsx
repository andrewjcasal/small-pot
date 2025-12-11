import { Link } from 'react-router-dom';
import './Navigation.css';

export default function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-name">Small Pot</span>
          <span className="brand-tagline">Stained Glass Studio</span>
        </Link>
      </div>
    </nav>
  );
}
