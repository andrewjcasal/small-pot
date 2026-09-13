import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import posthog from 'posthog-js';
import Footer from './components/Footer';
import Home from './pages/Home';
import Links from './pages/Links';
import Artists from './pages/Artists';
import CustomOrders from './pages/CustomOrders';
import NewsletterSignup from './pages/NewsletterSignup';
import Admin from './pages/admin/Admin';
import './App.css';

const footerlessRoutes = ['/links', '/artists', '/custom-orders', '/newsletter', '/admin'];

function AppContent() {
  const location = useLocation();
  const hideFooter = footerlessRoutes.includes(location.pathname);

  useEffect(() => {
    posthog.capture('$pageview');
  }, [location]);

  return (
    <div className="app">
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/links" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/links" element={<Links />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/creators" element={<Navigate to="/artists" replace />} />
          <Route path="/custom-orders" element={<CustomOrders />} />
          <Route path="/newsletter" element={<NewsletterSignup />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
