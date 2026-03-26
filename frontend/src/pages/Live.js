import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Play, User, LogOut, Shield, Radio, MessageSquare, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Live = () => {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("currentUser") || "Guest");
  const [isScrolled, setIsScrolled] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, user: 'Admin', text: 'Welcome to the Cyber Awareness session!' },
    { id: 2, user: 'SecurityBot', text: 'Please maintain decorum in the chat.' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const navigate = useNavigate();

  // 1. Security Check & Scroll Effect
  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      navigate('/login');
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMsg.trim()) {
      setMessages([...messages, { id: Date.now(), user: currentUser, text: inputMsg }]);
      setInputMsg('');
    }
  };

  return (
    <div className="bg-[#0b0b0b] min-h-screen text-white font-sans selection:bg-[#FFD700] selection:text-black">
      

      {/* --- Main Content --- */}
      <main className="pt-32 pb-20 px-6 md:px-20 max-w-7xl mx-auto">
        
        {/* Live Stream Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Video Player */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="relative aspect-video bg-zinc-900 rounded-[30px] overflow-hidden border border-white/10 group shadow-2xl">
              <div className="absolute top-5 left-5 z-10 flex items-center gap-3">
                <span className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter animate-pulse">
                  <Radio size={12} /> Live
                </span>
                <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-gray-300">
                  1,284 Watching
                </span>
              </div>
              
              {/* Fake Video Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 via-transparent to-transparent">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-20 h-20 bg-[#FFD700] rounded-full flex items-center justify-center text-black shadow-[0_0_50px_rgba(255,215,0,0.3)]">
                  <Play fill="currentColor" size={32} className="ml-1" />
                </motion.button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-black uppercase tracking-tighter">Threat Hunting: <span className="text-[#FFD700]">Malware Analysis</span></h1>
              <p className="text-gray-400 leading-relaxed">Live with AccessSports: Building a secure digital ecosystem through real-time awareness and defensive tactics.</p>
            </div>
          </motion.div>

          {/* Live Chat Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-[#161616] rounded-[30px] border border-white/10 flex flex-col h-[500px] lg:h-auto"
          >
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <MessageSquare size={16} className="text-[#FFD700]" /> Live Chat
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((m) => (
                <div key={m.id} className="text-sm">
                  <span className="font-black text-[#FFD700] uppercase text-[10px] mr-2">{m.user}:</span>
                  <span className="text-gray-300">{m.text}</span>
                </div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-black/40 rounded-b-[30px] flex gap-2">
              <input 
                type="text" value={inputMsg} onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#FFD700] transition-colors"
              />
              <button className="bg-[#FFD700] text-black p-2 rounded-xl hover:scale-105 transition-transform">
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>

        {/* --- Upcoming Sessions --- */}
        <section className="mt-24">
          <h3 className="text-2xl font-black uppercase mb-10 text-center tracking-[0.2em]">Next <span className="text-[#FFD700]">Operations</span></h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { day: 'Monday', time: '10:00 PM', title: 'Zero Day Exploit Analysis' },
              { day: 'Friday', time: '09:00 PM', title: 'Cloud Infrastructure Audit' }
            ].map((session, index) => (
              <div key={index} className="group bg-[#161616] p-8 rounded-[30px] border border-white/5 hover:border-[#FFD700]/30 transition-all cursor-pointer overflow-hidden relative">
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Shield size={120} />
                </div>
                <p className="text-[#FFD700] font-black text-[10px] tracking-widest mb-2 uppercase">{session.day} — {session.time}</p>
                <h4 className="text-2xl font-black uppercase">{session.title}</h4>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* --- Minimal Footer --- */}
      <footer className="border-t border-white/5 py-10 px-10 text-center text-gray-600 text-[10px] font-bold uppercase tracking-widest">
        © 2026 CyberShield Hub × AccessSports. Stay Secure.
      </footer>
    </div>
  );
};

export default Live;