import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API_URL from '../config';

const Report = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [news, setNews] = useState([]);
    const [commentInputs, setCommentInputs] = useState({});
    const [expandedPosts, setExpandedPosts] = useState({}); 
    
    const username = localStorage.getItem("currentUser") || "Guest";

    // 1. Fetch Data & Check Following Status
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postRes, newsRes] = await Promise.all([
                    fetch(`${API_URL}/api/reports`),
                    fetch(`${API_URL}/api/cyber-news`)
                ]);
                const postData = await postRes.json();
                const newsData = await newsRes.json();
                
                // Har post ke liye check karega ki aapne user ko follow kiya hai ya nahi
                const postsWithFollowStatus = await Promise.all(postData.map(async (post) => {
                    if (post.username === username) return post;
                    const followRes = await fetch(`${API_URL}/api/is-following/${username}/${post.username}`);
                    const followData = await followRes.json();
                    return { ...post, isFollowing: followData.following };
                }));

                setPosts(postsWithFollowStatus);
                if (newsData.success) setNews(newsData.news);
                setLoading(false);
            } catch (err) {
                console.error("Fetch error:", err);
                setLoading(false);
            }
        };
        fetchData();
    }, [username]);

    const toggleExpand = (id) => {
        setExpandedPosts(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // 2. Like Logic
    const handleLike = async (postId) => {
        const hasLiked = localStorage.getItem(`liked_${postId}_${username}`);
        if (hasLiked) return alert("Bhai, ek hi baar like kar sakte ho!");
        try {
            const res = await fetch(`${API_URL}/api/reports/${postId}/like`, { method: 'POST' });
            if (res.ok) {
                setPosts(posts.map(p => p._id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p));
                localStorage.setItem(`liked_${postId}_${username}`, "true");
            }
        } catch (err) { console.error("Like error"); }
    };

    // 3. Follow Logic (Fully Restored)
    const handleFollow = async (targetUser) => {
        if (targetUser === username) return;
        try {
            const res = await fetch(`${API_URL}/api/follow`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ follower: username, following: targetUser })
            });
            if (res.ok) {
                setPosts(posts.map(p => p.username === targetUser ? { ...p, isFollowing: true } : p));
            }
        } catch (err) { console.error("Follow error"); }
    };

    // 4. Share Logic
    const handleShare = async (post) => {
        if (navigator.share) {
            navigator.share({ title: 'Cyber Threat', text: post.text, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link Copied!");
        }
    };

    // 5. Comment Logic
    const handleComment = async (postId) => {
        const text = commentInputs[postId];
        if (!text) return;
        try {
            const res = await fetch(`${API_URL}/api/reports/${postId}/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, text })
            });
            const data = await res.json();
            if (data.success) {
                setPosts(posts.map(p => p._id === postId ? data.report : p));
                setCommentInputs({ ...commentInputs, [postId]: "" });
            }
        } catch (err) { console.error("Comment error"); }
    };

    return (
        <div className="bg-[#0b0b0b] min-h-screen text-white pt-20 md:pt-28 pb-24 md:pb-10 px-0 md:px-4">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
                <main className="flex-1 max-w-[650px] mx-auto w-full">
                    
                    {/* News Ticker */}
                    <div className="mb-8 overflow-hidden relative bg-[#0a0a0a] border border-zinc-800/50 py-3 rounded-2xl shadow-inner">
                        <div className="flex">
                            <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="flex whitespace-nowrap">
                                {[...news, ...news].map((n, i) => (
                                    <div key={i} className="flex items-center px-8 border-r border-zinc-900/50">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-3 animate-pulse"></span>
                                        <span className="text-red-500 font-extrabold text-[10px] uppercase tracking-wider mr-3">Live Alert</span>
                                        <span className="text-zinc-300 text-[11px] font-medium tracking-wide">{n}</span>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {loading ? (
                            <div className="text-center text-zinc-600 animate-pulse text-xs tracking-widest pt-20 font-mono">DECRYPTING FEED...</div>
                        ) : (
                            posts.map((post) => (
                                <motion.article 
                                key={post._id} 
                                initial={{opacity:0, y:20}} 
                                animate={{opacity:1, y:0}} 
                                className="bg-[#0f0f0f] border-y md:border border-zinc-800 md:rounded-[30px] overflow-hidden shadow-2xl transition hover:border-zinc-700 mx-0 md:mx-0"
                            >
                                    
                                    {/* Header Section */}
                                    <div className="p-4 flex items-center justify-between border-b border-zinc-900/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full border border-yellow-500/20 p-0.5 bg-zinc-800 overflow-hidden">
                                            {post.userProfilePic && post.userProfilePic.trim() !== "" ? (
                                                <img 
  src={post.userProfilePic ? `${post.userProfilePic}#${new Date().getTime()}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.username}`} 
  className="w-full h-full rounded-full object-cover" 
  alt="profile" 
  // error handle karne ke liye fallback
  onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.username}` }}
/>
                                            ) : (
                                            <img 
                                            src={`${post.userProfilePic}?t=${new Date().getTime()}`} 
                                            className="w-full h-full rounded-full" 
                                            alt="avatar" 
                                            />
                                            )}
                                        </div>
                                            <div>
                                                <p className="text-sm font-black text-white tracking-tight">{post.username}</p>
                                                <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Cyber Sentinel</p>
                                            </div>
                                        </div>
                                        {post.username !== username && (
                                            <button 
                                                onClick={() => handleFollow(post.username)} 
                                                className={`text-[10px] px-5 py-2 rounded-full font-black uppercase transition-all duration-300 ${post.isFollowing ? 'bg-zinc-800 text-zinc-500 cursor-default' : 'bg-yellow-600 text-black hover:bg-yellow-500 shadow-[0_0_15px_rgba(202,138,4,0.3)]'}`}
                                            >
                                                {post.isFollowing ? 'Following' : 'Follow'}
                                            </button>
                                        )}
                                    </div>

                                    {/* Image Logic (No duplicate text) */}
                                    {post.image ? (
                                        <div className="bg-black flex items-center justify-center border-b border-zinc-900/30">
                                            <img src={post.image} className="w-full h-auto max-h-[65vh] object-contain shadow-2xl shadow-black" alt="threat" />
                                        </div>
                                    ) : (
                                        <div className="p-8 bg-gradient-to-br from-zinc-900/40 to-black border-b border-zinc-900">
                                            <p className="text-sm text-zinc-300 leading-relaxed font-medium italic border-l-2 border-yellow-500 pl-4">"{post.text}"</p>
                                        </div>
                                    )}

                                    {/* Collapsible Solution Container */}
                                    <div className="p-5">
                                        <button 
                                            onClick={() => toggleExpand(post._id)}
                                            className={`w-full py-3 px-4 rounded-2xl border transition-all flex items-center justify-between ${expandedPosts[post._id] ? 'bg-yellow-500/10 border-yellow-500/40' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`w-2 h-2 rounded-full ${expandedPosts[post._id] ? 'bg-yellow-500 animate-pulse shadow-[0_0_10px_#eab308]' : 'bg-zinc-600'}`}></span>
                                                <p className={`text-[11px] font-black uppercase tracking-widest ${expandedPosts[post._id] ? 'text-yellow-500' : 'text-zinc-400'}`}>
                                                    {expandedPosts[post._id] ? 'Hide Intelligence Data' : 'View AI Threat Analysis'}
                                                </p>
                                            </div>
                                            <span className="text-zinc-500 text-[10px]">{expandedPosts[post._id] ? '▲' : '▼'}</span>
                                        </button>

                                        <AnimatePresence>
                                            {expandedPosts[post._id] && (
                                                <motion.div 
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="bg-[#141414] border-x border-b border-zinc-800/60 rounded-b-2xl p-5 font-mono">
                                                        <div className="text-[12px] text-zinc-400 whitespace-pre-wrap leading-loose">
                                                            {post.result || "Scanning database for results..."}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Footer / Interaction Bar */}
                                    <div className="px-6 py-4 flex gap-8 border-t border-zinc-900/50">
                                        <button onClick={() => handleLike(post._id)} className="group flex items-center gap-2 text-zinc-500 hover:text-red-500 transition">
                                            <span className="text-lg group-hover:scale-125 transition duration-300">❤️</span>
                                            <span className="text-xs font-bold font-mono tracking-tighter">{post.likes || 0}</span>
                                        </button>
                                        <button onClick={() => handleShare(post)} className="flex items-center gap-2 text-zinc-500 hover:text-yellow-500 transition">
                                            <span className="text-lg">↗️</span>
                                            <span className="text-xs font-bold uppercase tracking-widest text-[10px]">Share</span>
                                        </button>
                                        <div className="flex items-center gap-2 text-zinc-500">
                                            <span className="text-lg">💬</span>
                                            <span className="text-xs font-bold font-mono">{post.comments?.length || 0}</span>
                                        </div>
                                    </div>

                                    {/* Comments Section */}
                                    <div className="px-6 pb-6 pt-2 bg-black/20">
                                        <div className="space-y-2 mb-4 max-h-40 overflow-y-auto custom-scrollbar">
                                            {post.comments?.map((c, i) => (
                                                <div key={i} className="text-[11px] bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-800/30">
                                                    <span className="font-black text-yellow-600 mr-2 uppercase tracking-tighter">{c.username}</span>
                                                    <span className="text-zinc-400 font-medium">{c.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-3">
                                            <input 
                                                value={commentInputs[post._id] || ""}
                                                onChange={(e) => setCommentInputs({...commentInputs, [post._id]: e.target.value})}
                                                placeholder="Inject security comment..." 
                                                className="flex-1 bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-2.5 text-[11px] focus:outline-none focus:border-yellow-600/50 focus:ring-1 focus:ring-yellow-600/20 transition-all"
                                            />
                                            <button onClick={() => handleComment(post._id)} className="text-yellow-600 text-[10px] font-black px-3 hover:text-yellow-400 uppercase tracking-widest transition">Post</button>
                                        </div>
                                    </div>
                                </motion.article>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Report;