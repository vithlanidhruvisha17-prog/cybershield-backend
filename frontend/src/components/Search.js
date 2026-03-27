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
        setQuery('');
        setResults([]);
        navigate(`/analyst/${username}`);
    };

    return (
        <div className="relative w-full" ref={searchRef}>
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Analyst ID..."
                    className="w-full bg-[#1a1a1a] border border-[#FFD700]/30 rounded-full py-2 px-4 text-white text-[10px] md:text-xs focus:outline-none focus:border-[#FFD700] transition-all"
                />
                {loading && (
                    <div className="absolute right-3 w-3 h-3 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin"></div>
                )}
            </div>

            {/* 📈 FIXED DROPDOWN: Yeh Navbar ke overflow-hidden ko bypass karega */}
            {results.length > 0 && (
                <div 
                    className="fixed mt-2 bg-[#0d0d0d] border border-white/10 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-[99999]"
                    style={{ 
                        width: searchRef.current ? searchRef.current.offsetWidth : '300px',
                        // Calculate position based on input field
                        top: searchRef.current ? searchRef.current.getBoundingClientRect().bottom : '0px'
                    }}
                >
                    <div className="max-h-[250px] overflow-y-auto">
                        {results.map((item) => (
                            <div
                                key={item._id}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelect(item.username);
                                }}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-[#FFD700] group cursor-pointer border-b border-white/5 last:border-none transition-colors"
                            >
                                <div className="w-8 h-8 bg-white/5 group-hover:bg-black/20 rounded-full flex items-center justify-center text-[#FFD700] group-hover:text-black font-bold text-[10px] shrink-0">
                                    {item.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col text-left overflow-hidden">
                                    <p className="text-white group-hover:text-black text-xs font-bold truncate">@{item.username}</p>
                                    <p className="text-gray-500 group-hover:text-black/60 text-[9px] truncate">{item.fullname || 'Cyber Analyst'}</p>
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