import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Links from './pages/Links';
import Artists from './pages/Artists';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/links" element={<Links />} />
            <Route path="/artists" element={<Artists />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
