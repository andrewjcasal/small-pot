import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Home from './pages/Home';
import Links from './pages/Links';
import Artists from './pages/Artists';
import CustomOrders from './pages/CustomOrders';
import './App.css';

function AppContent() {
  const location = useLocation();
  const hideFooter = location.pathname === '/links';

  return (
    <div className="app">
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/links" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/links" element={<Links />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/custom-orders" element={<CustomOrders />} />
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
