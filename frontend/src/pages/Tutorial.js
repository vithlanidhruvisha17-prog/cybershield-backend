import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const tutorialsData = [
    {
        id: 1,
        title: "Network Security 101",
        category: "Ethical Hacking",
        level: "Beginner",
        duration: "15 Min",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800",
        description: "Learn how to secure enterprise networks from external threats and zero-day vulnerabilities."
    },
    {
        id: 2,
        title: "Web Pentesting Pro",
        category: "Cyber Defense",
        level: "Advanced",
        duration: "45 Min",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800",
        description: "Master the art of identifying SQL injections and XSS vulnerabilities in modern web apps."
    },
    {
        id: 3,
        title: "Cloud Infrastructure",
        category: "Cloud Security",
        level: "Intermediate",
        duration: "30 Min",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800",
        description: "Protect your AWS and Azure environments using industry-standard security protocols."
    }
];

const Tutorial = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (!isLoggedIn) navigate('/login');
    }, [navigate]);

    return (
        <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-[#FFD700] selection:text-black overflow-x-hidden">
            
            {/* --- HERO SECTION --- */}
<header className="relative pt-64 pb-32 px-10 text-center overflow-hidden">
    {/* Subtle Background Glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FFD700]/5 rounded-full blur-[120px] -z-10"></div>

    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <span className="text-[#FFD700] text-[10px] font-black tracking-[0.5em] uppercase border border-[#FFD700]/20 px-6 py-2 rounded-full mb-10 inline-block">
            PREMIUM ACADEMY
        </span>
        
        {/* Title without that top line issue */}
        <h1 className="text-7xl md:text-[130px] font-[1000] tracking-tighter uppercase leading-[0.8] mb-10">
            LEARN <span className="text-transparent" style={{ WebkitTextStroke: '2px #FFD700' }}>DEFENSE</span> <br /> 
            <span className="text-[#FFD700]">STAY</span> AHEAD
        </h1>
        
        <p className="text-gray-400 max-w-2xl mx-auto text-xl font-medium leading-tight">
            Access high-fidelity security labs and tutorials. <br/> Built for the next generation of <span className="text-white">Cyber Warriors.</span>
        </p>
    </motion.div>
</header>

            {/* --- STATS SECTION (Tadka 1: Glassmorphism) --- */}
            <section className="px-10 md:px-20 mb-32">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/[0.02] border border-white/5 p-8 rounded-[40px] backdrop-blur-md">
                    {[
                        { label: 'Courses', val: '50+' },
                        { label: 'Students', val: '12K' },
                        { label: 'Certificates', val: '8K' },
                        { label: 'Expert Mentors', val: '24' }
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <h4 className="text-[#FFD700] text-3xl font-black">{stat.val}</h4>
                            <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- TUTORIALS GRID --- */}
            <section className="px-8 md:px-20 pb-40">
                <div className="flex justify-between items-end mb-16 px-4">
                    <div>
                        <h2 className="text-4xl font-black uppercase italic">Top Curriculum</h2>
                        <div className="h-1 w-20 bg-[#FFD700] mt-2"></div>
                    </div>
                    <div className="flex gap-4">
                        <button className="text-[10px] font-bold uppercase tracking-widest text-[#FFD700]">Filter By Category</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {tutorialsData.map((course, index) => (
                        <motion.div 
                            key={course.id}
                            whileHover={{ y: -15 }}
                            className="relative group"
                        >
                            {/* Card Background Glow */}
                            <div className="absolute inset-0 bg-[#FFD700]/5 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            <div className="relative bg-[#111] rounded-[40px] border border-white/5 overflow-hidden transition-all duration-500 group-hover:border-[#FFD700]/50 shadow-2xl">
                                {/* Image Box */}
                                <div className="relative h-64 overflow-hidden">
                                    <img src={course.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent"></div>
                                    
                                    {/* Play Icon */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center text-black opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 shadow-[0_0_40px_#FFD700]">
                                            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="p-10">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-tighter">{course.category}</span>
                                        <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">{course.duration}</span>
                                    </div>
                                    <h3 className="text-3xl font-black mb-4 leading-none">{course.title}</h3>
                                    <p className="text-gray-500 text-sm mb-10 leading-relaxed font-light italic">"{course.description}"</p>
                                    
                                    <button className="w-full py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] group-hover:bg-[#FFD700] transition-colors shadow-xl">
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- CTA SECTION (Tadka 2: Big Bold Impact) --- */}
            <section className="px-10 py-32 bg-[#FFD700] text-black text-center mb-20 mx-10 rounded-[60px]">
                <h2 className="text-5xl md:text-7xl font-black uppercase leading-none mb-6 tracking-tighter">
                    Ready to join the <br /> elite 1%?
                </h2>
                <p className="text-black/60 font-bold mb-10 uppercase tracking-widest text-sm">Become a certified security specialist today.</p>
                <button className="bg-black text-white px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:scale-110 transition-transform">
                    Get Lifetime Access
                </button>
            </section>
        </div>
    );
};

export default Tutorial;