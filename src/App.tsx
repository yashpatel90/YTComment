import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/Layout';
import { Home } from './pages/Home';
import { Tool } from './pages/Tool';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-red-100 selection:text-red-900">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tool" element={<Tool />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
