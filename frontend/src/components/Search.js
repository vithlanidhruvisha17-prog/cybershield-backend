import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import API_URL from '../config';

const SearchAnalysts = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Jab user type karega tab ye function chalega
    useEffect(() => {
        const fetchResults = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/api/search-users?q=${query}`);
                setResults(response.data);
            } catch (error) {
                console.error("Search error:", error);
            }
            setLoading(false);
        };

        // Debouncing: User ke rukne ka wait karega (300ms) taaki baar-baar API call na ho
        const timeoutId = setTimeout(fetchResults, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSelect = (id) => {
        setQuery('');
        setResults([]);
        navigate(`/analyst/${id}`); // User ki profile par bhej dega
    };

    return (
        <div className="relative w-full">
            {/* Input Field */}
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Analyst ID..."
                className="w-full bg-white/10 border border-white/20 rounded-full py-1.5 px-4 text-white text-xs focus:outline-none focus:border-[#FFD700] transition-all"
            />

            {/* 📈 Search Results Dropdown */}
            {results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-[110]">
                    {results.map((item) => (
                        <div
                            key={item._id}
                            onClick={() => handleSelect(item._id)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-[#FFD700]/10 cursor-pointer border-b border-white/5 last:border-none"
                        >
                            <div className="w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center text-black font-bold text-xs">
                                {item.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-white text-xs font-bold">{item.username}</p>
                                <p className="text-gray-500 text-[10px]">{item.role || 'Cyber Analyst'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Loading Indicator */}
            {loading && (
                <div className="absolute right-4 top-2">
                    <div className="w-4 h-4 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
};

export default SearchAnalysts;