import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import API_URL from '../config';

const SearchAnalysts = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef(null);

    // Click outside dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setResults([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const targetURL = `${API_URL}/api/search-users?q=${query.trim()}`;
                const res = await axios.get(targetURL);
                setResults(res.data);
            } catch (error) {
                console.error("Search error:", error);
                setResults([]);
            }
            setLoading(false);
        };

        const timeoutId = setTimeout(fetchResults, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSelect = (username) => {
        console.log("Navigating to:", username);
        setQuery('');
        setResults([]);
        navigate(`/analyst/${username}`);
    };

    return (
        <div className="relative w-full" ref={searchRef}>
            {/* 🔍 Input Field */}
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Analyst ID..."
                    className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-4 text-white text-xs focus:outline-none focus:border-[#FFD700] focus:bg-white/10 transition-all placeholder:text-gray-500"
                />
                
                {/* 🌀 Stylish Spinner inside Input */}
                {loading && (
                    <div className="absolute right-3">
                        <div className="w-3.5 h-3.5 border-2 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {/* 📈 Search Results Dropdown */}
            {results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.7)] z-[9999] backdrop-blur-md">
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {results.map((item) => (
                            <div
                                key={item._id}
                                onMouseDown={(e) => {
                                    e.preventDefault(); // Stop blur
                                    handleSelect(item.username);
                                }}
                                className="group flex items-center gap-3 px-4 py-3 hover:bg-[#FFD700] transition-all cursor-pointer border-b border-white/5 last:border-none"
                            >
                                {/* Initial Circle */}
                                <div className="w-9 h-9 bg-white/10 group-hover:bg-black/20 rounded-full flex items-center justify-center text-[#FFD700] group-hover:text-black font-black text-sm shrink-0 transition-colors">
                                    {item.username.charAt(0).toUpperCase()}
                                </div>

                                {/* User Info */}
                                <div className="flex flex-col overflow-hidden text-left">
                                    <p className="text-white group-hover:text-black text-xs font-bold truncate transition-colors">
                                        @{item.username}
                                    </p>
                                    <p className="text-gray-500 group-hover:text-black/60 text-[10px] truncate transition-colors">
                                        {item.fullname || 'Field Agent'}
                                    </p>
                                </div>
                                
                                {/* Shortcut Arrow */}
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-black text-xs">→</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchAnalysts;