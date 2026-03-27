import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { motion } from 'framer-motion';
import { ShieldCheck, UserPlus } from 'lucide-react';
import API_URL from '../config';

const PublicProfile = () => {
    const { username } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        displayName: '',
        bio: '',
        avatarUrl: '',
        stats: { reports: 0, followers: 0, following: 0 },
        history: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                // 1. Fetch User Details (Axios use kar rahe hain ab)
                const userRes = await axios.get(`${API_URL}/api/user-details/${username}`);
                
                // 2. Fetch Stats and Reports in Parallel
                const [socialRes, countRes, historyRes] = await Promise.all([
                    axios.get(`${API_URL}/api/followers/${username}`).catch(() => ({ data: { followersCount: 0, followingCount: 0 } })),
                    axios.get(`${API_URL}/api/user-reports-count/${username}`).catch(() => ({ data: { count: 0 } })),
                    axios.get(`${API_URL}/api/user-reports/${username}`).catch(() => ({ data: [] }))
                ]);

                setProfile({
                    displayName: userRes.data.fullname || username,
                    bio: userRes.data.bio || 'Cyber Intelligence Officer',
                    avatarUrl: userRes.data.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
                    stats: {
                        followers: socialRes.data.followersCount || 0,
                        following: socialRes.data.followingCount || 0,
                        reports: countRes.data.count || 0
                    },
                    history: Array.isArray(historyRes.data) ? historyRes.data : []
                });
            } catch (err) {
                console.error("Profile Fetch Error:", err);
                // Agar user nahi mila toh home par bhej do
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        if (username) fetchAllData();
    }, [username, navigate]);

    if (loading) return (
        <div className="bg-[#0b0b0b] min-h-screen flex items-center justify-center">
            <div className="text-[#FFD700] animate-pulse font-black uppercase">Decrypting Profile...</div>
        </div>
    );

    return (
        <div className="bg-[#0b0b0b] min-h-screen text-white pt-24 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="flex flex-col md:flex-row items-center gap-10 mb-12">
                    <div className="w-32 h-32 rounded-full border-2 border-[#FFD700] p-1">
                        <img src={profile.avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold mb-2">{profile.displayName}</h2>
                        <div className="flex gap-6 justify-center md:justify-start mb-4">
                            <span>{profile.stats.reports} <small className="text-zinc-500">REPORTS</small></span>
                            <span>{profile.stats.followers} <small className="text-zinc-500">FOLLOWERS</small></span>
                        </div>
                        <p className="text-zinc-400">{profile.bio}</p>
                    </div>
                </header>
                {/* Evidence Log */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.history.map((post, idx) => (
                        <div key={idx} className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                             <p className="text-xs text-[#FFD700] mb-2 font-bold">CASE #{profile.history.length - idx}</p>
                             <p className="text-sm line-clamp-3">{post.result}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default PublicProfile;