import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import API_URL from '../config';

const PublicProfile = () => {
    const { username } = useParams();
    const navigate = useNavigate();

    // Sahi State Structure
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
                // 1. User Details
                const userRes = await axios.get(`${API_URL}/api/user-details/${username}`);
                const userData = userRes.data;

                // 2. Social & Stats
                const [socialRes, countRes, historyRes] = await Promise.all([
                    axios.get(`${API_URL}/api/followers/${username}`).catch(() => ({ data: { followersCount: 0, followingCount: 0 } })),
                    axios.get(`${API_URL}/api/user-reports-count/${username}`).catch(() => ({ data: { count: 0 } })),
                    axios.get(`${API_URL}/api/user-reports/${username}`).catch(() => ({ data: [] }))
                ]);

                // Ek hi baar mein poori state update (Errors khatam ho jayengi)
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
                console.error("Profile Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (username) fetchAllData();
    }, [username]);

    if (loading) return <div className="text-yellow-400 text-center mt-20">Decrypting Profile...</div>;

    return (
        <div className="bg-[#0b0b0b] min-h-screen text-white pt-24 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <img src={profile.avatarUrl} className="w-32 h-32 rounded-full mx-auto border-2 border-yellow-500 mb-4" alt="profile" />
                <h2 className="text-2xl font-bold">@{username}</h2>
                <p className="text-gray-400">{profile.displayName}</p>
                <div className="flex justify-center gap-10 my-6">
                    <div><p className="font-bold">{profile.stats.reports}</p><p className="text-xs text-gray-500">REPORTS</p></div>
                    <div><p className="font-bold">{profile.stats.followers}</p><p className="text-xs text-gray-500">FOLLOWERS</p></div>
                </div>
                <p className="italic text-gray-300">{profile.bio}</p>
            </div>
        </div>
    );
};
export default PublicProfile;