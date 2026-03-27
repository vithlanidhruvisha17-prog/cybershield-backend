import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; 
import { motion } from 'framer-motion';
import API_URL from '../config';

const PublicProfile = () => {
    const { username } = useParams();
    const currentUser = localStorage.getItem("currentUser");

    // 1. SAARE HOOKS TOP PAR
    const [profile, setProfile] = useState({
        displayName: '',
        bio: '',
        avatarUrl: '',
        stats: { reports: 0, followers: 0, following: 0 },
        history: []
    });
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    // 2. FETCH LOGIC
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const userRes = await axios.get(`${API_URL}/api/user-details/${username}`);
                const userData = userRes.data;

                // Promise.all mein "is-following" ka check bhi daal diya
                const [socialRes, countRes, historyRes, followCheckRes] = await Promise.all([
                    axios.get(`${API_URL}/api/followers/${username}`).catch(() => ({ data: { followersCount: 0, followingCount: 0 } })),
                    axios.get(`${API_URL}/api/user-reports-count/${username}`).catch(() => ({ data: { count: 0 } })),
                    axios.get(`${API_URL}/api/user-reports/${username}`).catch(() => ({ data: [] })),
                    // Check if current user is following this profile
                    currentUser 
                        ? axios.get(`${API_URL}/api/is-following/${currentUser}/${username}`).catch(() => ({ data: { following: false } }))
                        : { data: { following: false } }
                ]);

                setIsFollowing(followCheckRes.data.following); // Status update yahan ho jayega
                
                setProfile({
                    displayName: userData.fullname || username,
                    bio: userData.bio || 'Cyber Intelligence Officer',
                    avatarUrl: userData.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
                    stats: {
                        followers: socialRes.data.followersCount || 0,
                        following: socialRes.data.followingCount || 0,
                        reports: countRes.data.count || 0
                    },
                    history: Array.isArray(historyRes.data) ? historyRes.data : []
                });
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        if (username) fetchAllData();
    }, [username, currentUser]);

    // 3. HANDLE FOLLOW FUNCTION
    const handleFollow = async () => {
    if (!currentUser) return alert("Please login to perform this action!");
    if (currentUser === username) return alert("You can't follow yourself!");

    const endpoint = isFollowing ? '/api/unfollow' : '/api/follow';
    
    try {
        const res = await axios.post(`${API_URL}${endpoint}`, {
            follower: currentUser,
            following: username
        });

        if (res.data.success) {
            // UI Toggle
            setIsFollowing(!isFollowing);
            
            // Stats Update (Follower count +/- 1)
            setProfile(prev => ({
                ...prev,
                stats: { 
                    ...prev.stats, 
                    followers: isFollowing ? prev.stats.followers - 1 : prev.stats.followers + 1 
                }
            }));
        }
    } catch (err) {
        console.error("Follow/Unfollow error:", err);
        alert("Operation failed. Check connection.");
    }
};

    // 4. LOADING CHECK (Hooks ke baad)
    if (loading) return (
        <div className="bg-[#0b0b0b] min-h-screen flex flex-col items-center justify-center font-mono">
            <p className="text-[#FFD700] text-[10px] animate-pulse uppercase">Establishing Secure Link...</p>
        </div>
    );

    return (
        <div className="bg-[#0b0b0b] min-h-screen text-white font-sans selection:bg-[#FFD700] selection:text-black">
            <div className="max-w-4xl mx-auto pt-32 px-4 pb-20">
                
                <header className="flex flex-col md:flex-row items-center gap-10 md:gap-16 mb-12 pb-10 border-b border-zinc-800/50">
                    <div className="relative group">
                        <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-2 border-[#FFD700] p-1 overflow-hidden">
                            <img src={profile.avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1 rounded-full text-[8px] px-2 font-black border-4 border-[#0b0b0b]">VERIFIED</div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-5">
                            <h2 className="text-2xl font-light text-white">{profile.displayName}</h2>
                            <button 
    onClick={handleFollow}
    className={`px-8 py-1.5 rounded-md text-xs font-black uppercase transition-all active:scale-95 
        ${isFollowing 
            ? 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-red-500/50 hover:text-red-500' 
            : 'bg-[#FFD700] text-black'
        }`}
>
    {isFollowing ? 'Unfollow' : 'Follow'}
</button>
                        </div>
                        
                        <div className="flex justify-center md:justify-start gap-8 mb-6">
                            <div className="text-center md:text-left">
                                <span className="block text-lg font-bold">{profile.stats.reports}</span>
                                <span className="text-[10px] text-zinc-500 uppercase font-black">Reports</span>
                            </div>
                            <div className="text-center md:text-left">
                                <span className="block text-lg font-bold">{profile.stats.followers}</span>
                                <span className="text-[10px] text-zinc-500 uppercase font-black">Followers</span>
                            </div>
                            <div className="text-center md:text-left">
                                <span className="block text-lg font-bold">{profile.stats.following}</span>
                                <span className="text-[10px] text-zinc-500 uppercase font-black">Following</span>
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-[#FFD700] tracking-widest uppercase">Cyber Intelligence Officer</p>
                            <p className="text-sm text-zinc-400 max-w-md">{profile.bio}</p>
                        </div>
                    </div>
                </header>

                <div className="border-t border-zinc-800">
                    <div className="flex justify-center -mt-[1px]">
                        <div className="border-t-2 border-white pt-4 px-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">📑 Intelligence Logs</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                        {profile.history.map((post, idx) => (
                            <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5 hover:border-[#FFD700]/30 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[8px] bg-[#FFD700]/10 text-[#FFD700] px-2 py-1 rounded font-black uppercase">Intel #{profile.history.length - idx}</span>
                                    <span className="text-[8px] text-zinc-600 font-bold">{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-[11px] text-zinc-400 mb-3 italic line-clamp-2">"{post.text || post.description}"</p>
                                <div className="text-xs text-zinc-200 border-l-2 border-[#FFD700]/50 pl-3 leading-relaxed">
                                    {post.result ? post.result.replace(/\*\*/g, '').substring(0, 120) : "No detailed analysis available."}...
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;