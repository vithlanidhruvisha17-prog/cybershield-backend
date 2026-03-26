import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Target, Users, Zap } from 'lucide-react';

const About = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("isLoggedIn") !== "true") {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="bg-[#0b0b0b] min-h-screen text-white font-sans selection:bg-[#FFD700] selection:text-black overflow-x-hidden">
            
            {/* --- HERO SECTION (The Impact) --- */}
            <header className="relative pt-64 pb-32 px-10 text-center overflow-hidden">
                {/* Background Cyber Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-[#FFD700]/[0.05] rounded-full blur-[150px] -z-10"></div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.8 }}
                >
                    <div className="w-24 h-24 bg-[#FFD700] rounded-[30px] mb-12 flex items-center justify-center text-black text-5xl font-[1000] mx-auto shadow-[0_0_50px_rgba(255,215,0,0.3)] rotate-12 hover:rotate-0 transition-transform duration-500">
                        C
                    </div>
                    
                    <h1 className="text-6xl md:text-[110px] font-[1000] tracking-tighter uppercase leading-[0.8] mb-10">
                        OUR <span className="text-[#FFD700]">MISSION</span> <br />
                        <span className="text-transparent" style={{ WebkitTextStroke: '1.5px #FFD700' }}>YOUR</span> DEFENSE
                    </h1>
                    
                    <p className="text-gray-500 max-w-2xl mx-auto text-xl font-medium tracking-tight leading-relaxed">
                        We are building the future of digital defense. <br />
                        Making professional security accessible for <span className="text-white">every user, everywhere.</span>
                    </p>
                </motion.div>
            </header>

            {/* --- CORE VISION (Glassmorphism Card) --- */}
            <section className="px-10 md:px-20 py-20 relative">
                <div className="max-w-6xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-[#161616] to-[#0b0b0b] p-12 md:p-20 rounded-[60px] border border-white/5 shadow-2xl relative overflow-hidden group"
                    >
                        {/* Decorative Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                            <div className="flex-1">
                                <span className="text-[#FFD700] text-xs font-black tracking-[0.5em] uppercase mb-6 block">The Genesis</span>
                                <h2 className="text-4xl md:text-6xl font-black uppercase mb-8 leading-none italic text-white/90">
                                    SECURITY ISN'T A <br /> 
                                    <span className="text-[#FFD700] not-italic underline decoration-1 underline-offset-8">LUXURY.</span>
                                </h2>
                                <p className="text-gray-400 text-2xl font-bold leading-snug tracking-tight">
                                    CyberShield Hub was born from a simple realization: that the wall between "expert" and "user" is too high. 
                                    We provide the hammer to break it down.
                                </p>
                            </div>
                            <div className="w-full md:w-1/3 grid grid-cols-1 gap-6">
                                <div className="bg-black/40 p-8 rounded-3xl border border-white/5 hover:border-[#FFD700]/30 transition-colors">
                                    <Shield className="text-[#FFD700] mb-4" size={32} />
                                    <h4 className="font-black uppercase text-sm tracking-widest">Ironclad Security</h4>
                                </div>
                                <div className="bg-black/40 p-8 rounded-3xl border border-white/5 hover:border-[#FFD700]/30 transition-colors">
                                    <Zap className="text-[#FFD700] mb-4" size={32} />
                                    <h4 className="font-black uppercase text-sm tracking-widest">Instant Response</h4>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- STATS SECTION (Aggressive Style) --- */}
            <section className="px-10 md:px-20 py-32 grid grid-cols-1 md:grid-cols-3 gap-10">
                <motion.div whileHover={{ y: -10 }} className="text-center p-12 bg-[#121212] rounded-[40px] border border-white/5 border-b-4 border-b-[#FFD700]">
                    <h3 className="text-[#FFD700] text-7xl font-[1000] mb-2 tracking-tighter">100%</h3>
                    <p className="text-gray-500 font-black uppercase text-[10px] tracking-[0.3em]">Community Driven</p>
                </motion.div>
                
                <motion.div whileHover={{ y: -10 }} className="text-center p-12 bg-[#121212] rounded-[40px] border border-white/5 border-b-4 border-b-white">
                    <h3 className="text-white text-7xl font-[1000] mb-2 tracking-tighter">2026</h3>
                    <p className="text-gray-500 font-black uppercase text-[10px] tracking-[0.3em]">Establishment</p>
                </motion.div>

                <motion.div whileHover={{ y: -10 }} className="text-center p-12 bg-[#121212] rounded-[40px] border border-white/5 border-b-4 border-b-[#FFD700]">
                    <h3 className="text-[#FFD700] text-7xl font-[1000] mb-2 tracking-tighter">FREE</h3>
                    <p className="text-gray-500 font-black uppercase text-[10px] tracking-[0.3em]">Knowledge Hub</p>
                </motion.div>
            </section>

            {/* --- TEAM/JOIN SECTION (The Hook) --- */}
            <section className="px-10 py-32 bg-[#FFD700] text-black text-center mb-20 mx-10 rounded-[60px] relative overflow-hidden">
                {/* Abstract Pattern background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#000_1px,_transparent_1px)] [background-size:20px_20px]"></div>
                </div>
                
                <h2 className="text-5xl md:text-8xl font-[1000] uppercase leading-[0.8] mb-10 tracking-tighter relative z-10">
                    WANT TO <br /> BECOME A <br /> DEFENDER?
                </h2>
                <button 
                    onClick={() => navigate('/signup')}
                    className="bg-black text-white px-16 py-6 rounded-full font-black text-sm uppercase tracking-[0.3em] hover:scale-110 transition-transform relative z-10 shadow-2xl"
                >
                    JOIN THE HUB
                </button>
            </section>
        </div>
    );
};

export default About;