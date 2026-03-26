import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components (Hum inhe abhi banayenge)
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Report from './pages/Report';
import Profile from './pages/Profile'; 
import Tutorial from './pages/Tutorial';
import Live from './pages/Live';
import About from './pages/About';
import PublicProfile from './pages/PublicProfile';
import Navbar from './components/Navbar';
import SearchAnalysts from './components/Search';

function App() {
  return (
    <Router>
      <div className="bg-gray-900 min-h-screen text-white">
        {/* Navbar ko Routes ke upar rakho taaki wo har page pe dikhe */}
        <Navbar /> 
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/report" element={<Report />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Tutorial" element={<Tutorial />} />
          <Route path="/Live" element={<Live />} />
          <Route path="/About" element={<About />} />
          <Route path="/Profile/:username" element={<PublicProfile />} />
          <Route path="/Search" element={<SearchAnalysts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;