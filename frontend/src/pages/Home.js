import React from 'react'; 
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
    const navigate = useNavigate();

    // Animations variables (Keep these)
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="bg-[#0b0b0b] text-white font-sans selection:bg-[#FFD700] selection:text-black min-h-screen overflow-x-hidden">
            
            <header className="relative pt-64 pb-24 px-10 text-center overflow-hidden">
    {/* Subtle Golden Glow - Adjusted for 2 lines */}
    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#FFD700]/[0.05] rounded-full blur-[120px] -z-10"></div>

    <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
    >
        {/* Compact Badge */}
        <span className="text-[#FFD700] text-[9px] font-black tracking-[0.4em] uppercase border border-[#FFD700]/20 px-4 py-1.5 rounded-full mb-10 inline-block bg-[#FFD700]/5">
            Proactive Defense System
        </span>

        {/* 2-LINE IMPACTFUL HEADING */}
        <h1 className="text-6xl md:text-[95px] font-[1000] tracking-tighter uppercase leading-[0.85] mb-10 select-none">
            {/* Top Line: Yellow & Solid */}
            <span className="text-[#FFD700] drop-shadow-[0_0_30px_rgba(255,215,0,0.2)]">EMPOWERING</span> <br />
            
            {/* Bottom Line: Golden Stroke + White accent */}
            <span className="text-transparent" style={{ WebkitTextStroke: '1.5px #FFD700' }}>DIGITAL</span>{' '}
            <span className="text-white opacity-90">CONFIDENCE</span>
        </h1>
        
        {/* Refined Subtext */}
        <p className="text-gray-500 max-w-2xl mx-auto text-lg md:text-xl font-medium tracking-tight mb-14 leading-tight border-l-2 border-[#FFD700]/20 pl-6">
            Your Premium Hub for Proactive Cyber Defense, <br />
            Advanced Tutorials, and Real-time Security Insights.
        </p>

        {/* Explore Button: Golden Theme */}
        <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "#FFD700", color: "#000" }} 
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/report')} 
            className="group relative overflow-hidden border-2 border-[#FFD700] text-[#FFD700] font-[900] px-12 py-4 rounded-full uppercase text-xs tracking-[0.2em] transition-all duration-500"
        >
            <span className="relative z-10">EXPLORE FEATURES →</span>
            <div className="absolute inset-0 bg-[#FFD700] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 -z-0"></div>
        </motion.button>
    </motion.div>
</header>

            {/* --- Features Section (Rest of the page, unedited) --- */}
            <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="px-10 md:px-20 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 z-10 relative">
                {/* ... Feature cards code is the same ... */}
                <motion.div variants={itemVariants} className="bg-[#161616] p-12 rounded-[40px] border border-white/5 hover:border-[#FFD700]/20 transition-all group">
                    <div className="flex justify-between mb-8">
                        <div className="w-16 h-16 bg-[#FFD700] rounded-2xl flex items-center justify-center text-4xl">🔗</div>
                        <span className="text-[10px] font-bold text-[#FFD700] border border-[#FFD700]/30 px-4 py-1.5 rounded-full uppercase">Phishing Detector</span>
                    </div>
                    <h3 className="text-4xl font-black mb-4">Link Analysis</h3>
                    <p className="text-gray-500 mb-8 text-lg">Scan any suspicious URL against our massive AI database to ensure safety.</p>
                    <button onClick={() => navigate('/report')} className="w-full bg-white/5 py-5 rounded-2xl font-bold hover:bg-[#FFD700] hover:text-black transition-all">Start Scanning</button>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-[#161616] p-12 rounded-[40px] border border-white/5 hover:border-[#FFD700]/20 transition-all group">
                    <div className="flex justify-between mb-8">
                        <div className="w-16 h-16 bg-[#FFD700] rounded-2xl flex items-center justify-center text-4xl">📸</div>
                        <span className="text-[10px] font-bold text-red-500 border border-red-500/30 px-4 py-1.5 rounded-full uppercase tracking-widest">Advanced OCR</span>
                    </div>
                    <h3 className="text-4xl font-black mb-4">Image Scan</h3>
                    <p className="text-gray-500 mb-8 text-lg">Upload screenshots of messages or emails to detect hidden malicious content.</p>
                    <button onClick={() => navigate('/report')} className="w-full bg-white/5 py-5 rounded-2xl font-bold hover:bg-[#FFD700] hover:text-black transition-all">Upload Image</button>
                </motion.div>
            </motion.section>

            {/* --- About Section (From your code, unedited) --- */}
            <section className="px-10 md:px-20 py-32 flex flex-col md:flex-row items-center gap-20 z-10 relative">
                <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} className="w-full md:w-1/2">
                    <h2 className="text-6xl font-black mb-8 leading-tight">ABOUT THE <br/><span className="text-[#FFD700]">PLATFORM</span></h2>
                    <p className="text-gray-400 text-xl leading-relaxed mb-10">
                        CyberShield Hub is a community-driven platform designed to make security knowledge accessible. From reporting threats to learning advanced prevention, we've got you covered.
                    </p>
                    <div className="flex gap-6">
                        <div className="bg-[#161616] p-6 rounded-3xl border border-white/5 flex-1 text-center">
                            <p className="text-[#FFD700] text-4xl font-black">2026</p>
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-2">Latest Edition</p>
                        </div>
                        <div className="bg-[#161616] p-6 rounded-3xl border border-white/5 flex-1 text-center">
                            <p className="text-[#FFD700] text-4xl font-black">100%</p>
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-2">Secure Hub</p>
                        </div>
                    </div>
                </motion.div>
                <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="w-full md:w-1/2 h-[450px] bg-[#161616] rounded-[50px] border border-white/5 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD700]/10 to-transparent animate-pulse"></div>
                    <div className="relative text-center">
                        <div className="text-8xl mb-4">🛡️</div>
                        <p className="text-gray-500 font-black tracking-[0.2em] uppercase">Security Verified</p>
                    </div>
                </motion.div>
            </section>

            {/* Footer (From your code, unedited) */}
            <footer className="px-10 md:px-20 py-16 border-t border-white/5 bg-[#0b0b0b] text-center md:text-left z-10 relative">
                <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                    <div>
                        <div className="text-[#FFD700] text-3xl font-black tracking-tighter mb-2">CyberShield Hub</div>
                        <p className="text-gray-600 text-sm italic">© 2026 Proactive Defense System.</p>
                    </div>
                    <div className="flex space-x-8">
                        {['Instagram', 'Twitter', 'LinkedIn'].map(social => (
                            <a  key={social}  className="text-gray-500 hover:text-[#FFD700] font-bold uppercase text-xs tracking-widest transition-colors">{social}</a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
