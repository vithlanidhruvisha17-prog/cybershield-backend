import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, UserPlus } from 'lucide-react';
import API_URL from '../config';

const PublicProfile = () => {
    const { username } = useParams(); // URL se username nikalne ke liye
    const navigate = useNavigate();

    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [stats, setStats] = useState({ reports: 0, followers: 0, following: 0 });
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (username) {
            fetchPublicProfileData(username);
        }
    }, [username]);

    const fetchPublicProfileData = async (user) => {
        try {
            setLoading(true);
            
            // 1. Fetch User Details
            const resUser = await fetch(`${API_URL}/api/user-details/${user}`);
            const userData = await resUser.json();
            
            if (resUser.ok) {
                setDisplayName(userData.fullname || user);
                setBio(userData.bio || 'Cyber Intelligence Officer');
                setAvatarUrl(userData.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user}`);
            } else {
                // Agar user nahi mila toh 404 ya back bhej do
                alert("Analyst not found!");
                navigate('/report');
            }

            // 2. Fetch Stats & History
            const resSocial = await fetch(`${API_URL}/api/followers/${user}`);
            const dataSocial = await resSocial.json();
            const resCount = await fetch(`${API_URL}/api/user-reports-count/${user}`);
            const dataCount = await resCount.json();
            const resHistory = await fetch(`${API_URL}/api/user-reports/${user}`);
            const dataHistory = await resHistory.json();

            setStats({
                followers: dataSocial.followersCount || 0,
                following: dataSocial.followingCount || 0,
                reports: dataCount.count || 0
            });
            setHistory(dataHistory || []);
        } catch (err) {
            console.error("Public Profile fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-[#0b0b0b] min-h-screen flex items-center justify-center">
                <div className="text-[#FFD700] animate-pulse font-black uppercase tracking-[0.3em]">Decrypting Profile...</div>
            </div>
        );
    }

    return (
        <div className="bg-[#0b0b0b] min-h-screen text-white font-sans selection:bg-[#FFD700] selection:text-black">
            <div className="max-w-4xl mx-auto pt-32 px-4 pb-20">
                
                {/* Header Section */}
                <header className="flex flex-col md:flex-row items-center gap-10 md:gap-16 mb-12 pb-10 border-b border-zinc-800/50">
                    <div className="relative group">
                        <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-2 border-[#FFD700] p-1 transition-transform duration-500 overflow-hidden">
                            <img src={avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1 rounded-full text-[8px] px-2 font-black border-4 border-[#0b0b0b]">VERIFIED</div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-5">
                            <h2 className="text-2xl font-light text-white">{displayName}</h2>
                            <button className="bg-[#FFD700] text-black px-6 py-1 rounded-md text-xs font-bold hover:bg-yellow-400 transition-all flex items-center justify-center gap-2">
                                <UserPlus size={14} /> Follow Analyst
                            </button>
                        </div>
                        
                        <div className="flex justify-center md:justify-start gap-8 mb-6">
                            <div className="text-center md:text-left">
                                <span className="block text-lg font-bold">{stats.reports}</span>
                                <span className="text-[10px] text-zinc-500 uppercase font-black">Reports</span>
                            </div>
                            <div className="text-center md:text-left">
                                <span className="block text-lg font-bold">{stats.followers}</span>
                                <span className="text-[10px] text-zinc-500 uppercase font-black">Followers</span>
                            </div>
                            <div className="text-center md:text-left">
                                <span className="block text-lg font-bold">{stats.following}</span>
                                <span className="text-[10px] text-zinc-500 uppercase font-black">Following</span>
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-[#FFD700] tracking-widest uppercase">Cyber Intelligence Officer</p>
                            <p className="text-sm text-zinc-400 max-w-md">{bio}</p>
                        </div>
                    </div>
                </header>

                {/* History Grid (Only View Mode) */}
                <div className="border-t border-zinc-800">
                    <div className="flex justify-center -mt-[1px]">
                        <div className="border-t-2 border-[#FFD700] pt-4 px-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">📑 Evidence Log</div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                        {history.length > 0 ? (
                            history.map((post, idx) => (
                                <motion.div key={idx} className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5 hover:border-[#FFD700]/30 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[8px] bg-[#FFD700]/10 text-[#FFD700] px-2 py-1 rounded font-black uppercase">Report #{history.length - idx}</span>
                                        <span className="text-[8px] text-zinc-600 font-bold">{new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-[11px] text-zinc-400 mb-3 italic line-clamp-2">"{post.text || "Binary Data Evidence"}"</p>
                                    <div className="text-xs text-zinc-200 border-l-2 border-[#FFD700]/50 pl-3 leading-relaxed">
                                        {post.result ? post.result.replace(/\*\*/g, '').substring(0, 150) : "Processing..."}...
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-zinc-700 italic text-sm">This analyst hasn't published any logs yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;