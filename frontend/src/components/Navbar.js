import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SearchAnalysts from './Search';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    
    const username = localStorage.getItem("currentUser") || "User";
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    // Scroll effect logic
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* --- TOP NAVBAR (Desktop Focus) --- */}
            <nav className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-20 transition-all duration-500 ${
                scrolled ? 'bg-[#0b0b0b]/90 backdrop-blur-xl py-4 border-b border-white/10' : 'py-8'
            }`}>
                
                {/* 1. Logo Section */}
                <div 
                    className={`flex items-center gap-2 cursor-pointer min-w-fit transition-all duration-500 ${isSearchOpen ? 'md:opacity-100 opacity-0 scale-95' : 'opacity-100 scale-100'}`} 
                    onClick={() => navigate('/')}
                >
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-[#FFD700] rounded-lg flex items-center justify-center text-black font-black text-xl shadow-[0_0_15px_rgba(255,215,0,0.3)] group-hover:rotate-12 transition-transform">C</div>
                    <span className="text-[#FFD700] text-lg md:text-2xl font-black tracking-tighter uppercase hidden sm:block">Cybershield Hub</span>
                </div>

                {/* 2. Central Navigation & Search Push Area */}
                <div className="flex items-center flex-1 justify-center">
                    <div className="flex items-center">
                        {/* 🔍 Animated Search Section */}
                        <div className="flex items-center">
                            <button 
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="z-20 text-[#FFD700] p-2 hover:scale-125 transition-transform duration-300 focus:outline-none"
                            >
                                {isSearchOpen ? '✕' : '🔍'}
                            </button>

                            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                                isSearchOpen ? 'w-[180px] sm:w-[250px] md:w-[350px] ml-2 opacity-100' : 'w-0 opacity-0'
                            }`}>
                                <div className="min-w-[180px] sm:min-w-[250px] md:min-w-[350px]">
                                    <SearchAnalysts />
                                </div>
                            </div>
                        </div>

                        {/* 🧭 Nav Links (Visible on Desktop, hidden on Mobile to avoid clutter) */}
                        <ul className={`hidden md:flex items-center gap-6 md:gap-10 transition-all duration-500 ease-in-out ${isSearchOpen ? 'ml-10' : 'ml-6'}`}>
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Posts', path: '/report' },
                                { name: 'Tutorial', path: '/tutorial' },
                                { name: 'Live', path: '/live' },
                                { name: 'About', path: '/about' }
                            ].map((item) => (
                                <li key={item.name} className="whitespace-nowrap">
                                    <Link 
                                        to={item.path} 
                                        className={`text-[11px] font-bold uppercase tracking-widest transition-all duration-300 relative pb-1 ${
                                            isActive(item.path)
                                            ? "text-[#FFD700] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#FFD700]"
                                            : "text-gray-400 hover:text-white"
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 3. Profile & Logout Section */}
                <div className="flex items-center gap-4 min-w-fit">
                    {isLoggedIn ? (
                        <div className={`flex items-center gap-2 bg-white/5 p-1 md:pr-4 rounded-full border border-white/10 transition-all duration-500 ${isSearchOpen ? 'md:opacity-100 opacity-0' : 'opacity-100'}`}>
                            <Link to="/profile" className="flex items-center gap-2">
                                <div className="w-7 h-7 md:w-8 md:h-8 bg-[#FFD700] rounded-full flex items-center justify-center text-black font-black text-xs md:text-sm">
                                    {username.charAt(0).toUpperCase()}
                                </div>
                                <span className="hidden md:inline text-[#FFD700] text-xs font-bold uppercase tracking-widest">{username}</span>
                            </Link>
                            <button onClick={handleLogout} className="hidden md:block text-[9px] font-black text-red-500 px-2 border-l border-white/10 ml-2 hover:text-red-400 transition-colors">OUT</button>
                        </div>
                    ) : (
                        <Link to="/login" className="bg-[#FFD700] text-black text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full border-2 border-[#FFD700] hover:bg-transparent hover:text-[#FFD700] transition-all">Login</Link>
                    )}
                </div>
            </nav>

            {/* --- BOTTOM NAVBAR (Instagram Style - Only Mobile) --- */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#0b0b0b]/95 backdrop-blur-2xl border-t border-white/10 px-4 py-3 flex justify-around items-center pb-safe">
                {[
                    { name: 'Home', path: '/', icon: '🏠' },
                    { name: 'Feed', path: '/report', icon: '📡' },
                    { name: 'Tutorial', path: '/tutorial', icon: '📖' },
                    { name: 'Live', path: '/live', icon: '🔴' },
                    { name: 'Me', path: '/profile', icon: '👤' }
                ].map((item) => (
                    <Link 
                        key={item.name} 
                        to={item.path} 
                        className={`flex flex-col items-center gap-1 transition-all ${isActive(item.path) ? "scale-110 text-[#FFD700]" : "text-gray-500"}`}
                    >
                        <div className="text-xl">{item.icon}</div>
                        <span className={`text-[8px] font-black uppercase tracking-tighter ${isActive(item.path) ? "opacity-100" : "opacity-50"}`}>
                            {item.name}
                        </span>
                    </Link>
                ))}
            </div>
        </>
    );
};

export default Navbar;