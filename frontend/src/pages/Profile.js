import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Camera, Save, X, ShieldCheck } from 'lucide-react';
import API_URL from '../config';

const Profile = () => {
    // 1. Original States (Scanner & Data)
    const [username, setUsername] = useState('');
    const [stats, setStats] = useState({ reports: 0, followers: 0, following: 0 });
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inputText, setInputText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    // 2. Profile Display States (Customizable)
    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('🔍 Hunting threats, protecting the hub. Specializing in Phishing and Social Engineering analysis. 🛡️');
    const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=300');

    // 3. Edit Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [tempDisplayName, setTempDisplayName] = useState('');
    const [tempBio, setTempBio] = useState('');
    const [tempAvatar, setTempAvatar] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fileInputRef = useRef(null);
    const navigate = useNavigate();

   useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn || !currentUser) {
        navigate('/login');
        return;
    }

    setUsername(currentUser);
    
    // Sirf fetchProfileData call karo, LocalStorage se mat uthao
    fetchProfileData(currentUser);
}, [navigate]);

    const fetchProfileData = async (user) => {
    try {
        setLoading(true);
        
        // 1. Fetch User Details (Bio, Name, ProfilePic)
        const resUser = await fetch(`${API_URL}/api/user-details/${user}`);
        const userData = await resUser.json();
        
        if (resUser.ok) {
            setDisplayName(userData.fullname || user);
            setBio(userData.bio || 'Cyber Intelligence Officer');
            setAvatarUrl(userData.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user}`);
        }

        // 2. Fetch Stats & History (Jo pehle se tha)
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
        console.error("Profile fetch error:", err);
    } finally {
        setLoading(false);
    }
};

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setInputText("AI is reading the screenshot... 🔍");
        const formData = new FormData();
        formData.append('image', file);
        formData.append('username', username);
        try {
            const res = await fetch(`${API_URL}/analyze-image`, { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) setInputText(data.result || "Text extracted!");
        } catch (err) { alert("OCR Failed!"); setInputText(""); }
    };

    const handleAnalyze = async () => {
        if (!inputText || inputText.includes("reading")) return alert("Please enter text or upload image!");
        setIsAnalyzing(true);
        try {
            const res = await fetch(`${API_URL}/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: inputText, username: username })
            });
            const data = await res.json();
            if (data.success) {
                alert("AI Analysis Complete! Redirecting to feed...");
                navigate('/report');
            }
        } catch (err) { alert("Analysis failed!"); } finally { setIsAnalyzing(false); }
    };

    const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 400; // Profile pic ke liye itna kaafi hai
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // 0.7 compression quality (size 90% kam ho jayega)
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); 
                setTempAvatar(compressedDataUrl);
            };
        };
        reader.readAsDataURL(file);
    }
};

   const saveProfileChanges = async () => {
    setIsSaving(true);
    try {
        const payload = { 
            username: username, 
            displayName: tempDisplayName || displayName, 
            bio: tempBio || bio,                        
            newProfilePic: tempAvatar || avatarUrl 
        };

        const response = await fetch(`${API_URL}/api/update-profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.success) {
            setDisplayName(payload.displayName);
            setBio(payload.bio);
            if (tempAvatar) setAvatarUrl(tempAvatar);

            localStorage.setItem("userPic", tempAvatar || avatarUrl);
            
            setIsEditModalOpen(false);
            alert("Profile Updated Successfully! 🛡️");
        } else {
            alert("Update failed: " + (data.error || "Unknown error"));
        }
    } catch (err) {
        console.error("Sync Error:", err);
        alert("Server error. Check console.");
    } finally {
        setIsSaving(false);
    }
};

    return (
        <div className="bg-[#0b0b0b] min-h-screen text-white font-sans selection:bg-[#FFD700] selection:text-black">
            <div className="max-w-4xl mx-auto pt-32 px-4 pb-20">
                
                {/* Header Section */}
                <header className="flex flex-col md:flex-row items-center gap-10 md:gap-16 mb-12 pb-10 border-b border-zinc-800/50">
                    <div className="relative group">
                        <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-2 border-[#FFD700] p-1 group-hover:rotate-12 transition-transform duration-500 overflow-hidden">
                            <img src={avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1 rounded-full text-[8px] px-2 font-black border-4 border-[#0b0b0b]">VERIFIED</div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-5">
                            <h2 className="text-2xl font-light text-white">{displayName || username}</h2>
                            <button 
                                onClick={() => {
                                    setTempDisplayName(displayName);
                                    setTempBio(bio);
                                    setTempAvatar('');
                                    setIsEditModalOpen(true);
                                }}
                                className="bg-white/5 border border-white/10 px-6 py-1 rounded-md text-xs font-bold hover:bg-white hover:text-black transition-all"
                            >
                                Edit Profile
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

                {/* Analysis Tool Section */}
                <section className="mb-16">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/20 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
                        <h3 className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.2em] mb-4">Neural Threat Scanner</h3>
                        <textarea 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="w-full bg-black/40 border border-zinc-800 rounded-xl p-4 text-sm focus:outline-none focus:border-[#FFD700] transition-all resize-none text-zinc-300 min-h-[120px]" 
                            placeholder="Paste suspicious link, message or code snippet here..." 
                        />
                        <div className="flex flex-wrap justify-between items-center mt-5 gap-4">
                            <label className="flex items-center gap-3 text-zinc-500 hover:text-[#FFD700] cursor-pointer transition group">
                                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-[#FFD700]/50 transition-all">📸</div>
                                <span className="text-[10px] font-black uppercase">Upload Screenshot</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                            </label>
                            <button onClick={handleAnalyze} disabled={isAnalyzing} className={`${isAnalyzing ? 'bg-zinc-700' : 'bg-[#FFD700] hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]'} text-black px-10 py-3 rounded-xl font-black text-[10px] uppercase transition-all flex items-center gap-2`}>
                                {isAnalyzing ? "Processing..." : "Run AI Diagnostics"} ⚡
                            </button>
                        </div>
                    </motion.div>
                </section>

                {/* History Grid */}
                <div className="border-t border-zinc-800">
                    <div className="flex justify-center -mt-[1px]">
                        <div className="border-t-2 border-white pt-4 px-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">📑 Scan Logs</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                        {loading ? (
                            <div className="col-span-full text-center py-10 text-zinc-600 animate-pulse text-xs uppercase tracking-widest font-black">Accessing Encrypted History...</div>
                        ) : history.length > 0 ? (
                            history.map((post, idx) => (
                                <motion.div key={idx} className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5 hover:border-[#FFD700]/30 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[8px] bg-[#FFD700]/10 text-[#FFD700] px-2 py-1 rounded font-black uppercase">Security Log #{history.length - idx}</span>
                                        <span className="text-[8px] text-zinc-600 font-bold">{new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-[11px] text-zinc-400 mb-3 italic line-clamp-2">"{post.text || "Binary Data Evidence"}"</p>
                                    <div className="text-xs text-zinc-200 border-l-2 border-[#FFD700]/50 pl-3 leading-relaxed">
                                        {post.result ? post.result.replace(/\*\*/g, '').substring(0, 120) : "Processing analysis..."}...
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-zinc-700 italic text-sm">No threats analyzed yet.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* EDIT MODAL */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <motion.div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[500] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="bg-[#111] border border-white/10 w-full max-w-lg rounded-3xl p-8 relative shadow-2xl" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white"><X /></button>
                            <h3 className="text-2xl font-black mb-8 italic uppercase">Edit <span className="text-[#FFD700]">Analyst Profile</span></h3>
                            
                            <div className="flex flex-col items-center mb-8">
                                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                                    <div className="w-24 h-24 rounded-full border-2 border-[#FFD700] p-1 overflow-hidden">
                                        <img src={tempAvatar || avatarUrl} className="w-full h-full rounded-full object-cover opacity-60 group-hover:opacity-100 transition" alt="Preview" />
                                    </div>
                                    <Camera className="absolute inset-0 m-auto text-[#FFD700]" size={28} />
                                    <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
                                </div>
                                <p className="text-[9px] text-zinc-500 uppercase mt-2 tracking-widest">Update Identification Photo</p>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="text-[10px] text-[#FFD700] uppercase font-bold mb-2 block tracking-widest">Display Name</label>
                                    <input value={tempDisplayName} onChange={(e) => setTempDisplayName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl focus:outline-none focus:border-[#FFD700] text-sm" />
                                </div>
                                <div>
                                    <label className="text-[10px] text-[#FFD700] uppercase font-bold mb-2 block tracking-widest">Mission Bio</label>
                                    <textarea value={tempBio} onChange={(e) => setTempBio(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl h-24 focus:outline-none focus:border-[#FFD700] resize-none text-sm" />
                                </div>
                                <button onClick={saveProfileChanges} className="w-full bg-[#FFD700] text-black font-black py-4 rounded-xl uppercase tracking-widest hover:bg-yellow-400 transition">
                                    {isSaving ? "Synchronizing Data..." : "Apply Changes"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;