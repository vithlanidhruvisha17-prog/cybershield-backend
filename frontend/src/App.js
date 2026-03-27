import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
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
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    // Jab tak real ID nahi hai, tab tak "dummy-id" likh do error hatane ke liye
    <GoogleOAuthProvider clientId="995270794492-g01b7g5mnocotc3vjtrro0jcl24c6f7d.apps.googleusercontent.com">
      <Router>
        <div className="bg-gray-900 min-h-screen text-white">
          <Navbar /> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/report" element={<Report />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/tutorial" element={<Tutorial />} />
            <Route path="/live" element={<Live />} />
            <Route path="/about" element={<About />} />
            <Route path="/analyst/:username" element={<PublicProfile />} />
            <Route path="/search" element={<SearchAnalysts />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;