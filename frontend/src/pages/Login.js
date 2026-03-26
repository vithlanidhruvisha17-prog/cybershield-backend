import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Page refresh hone se rokta hai
        try {
            // Humne backend URL localhost:5000 rakha hai, aap change kar sakte ho
            const res = await axios.post(`${API_URL}/api/login`,
                { 
                username, 
                password 
            });

            if (res.data.success) {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("currentUser", res.data.user.username);
                // Login hote hi Home ya Report par bhej do
                navigate('/'); 
            } else {
                alert("Ghalat details bhai!");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Can not connect with server");
        }
    };

    return (
        <div className="bg-[#0b0b0b] text-white min-h-screen font-sans selection:bg-[#FFD700] selection:text-black">

            {/* Main Content */}
            <main className="min-h-screen flex justify-center items-center pt-32 pb-10 px-4">
                <div className="flex flex-col md:flex-row w-full max-w-5xl bg-[#121212] rounded-[35px] overflow-hidden shadow-2xl border border-white/5">
                    {/* Left Side (Branding) */}
                    <div className="w-full md:w-5/12 p-12 md:p-16 flex flex-col justify-center bg-gradient-to-br from-[#1a1a1a] to-[#121212]">
                        <h1 className="text-5xl md:text-6xl font-black leading-[0.9] mb-6 tracking-tighter uppercase">
                            CYBER <br /> <span className="text-white/90">SECURITY</span>
                        </h1>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-[260px]">
                            A Platform to Report, Analyze & Prevent Cyber Threats
                        </p>
                        <div className="mt-10 w-20 h-1 bg-[#FFD700] rounded-full opacity-50"></div>
                    </div>

                    {/* Right Side (Form) */}
                    <div className="w-full md:w-7/12 p-10 md:p-14 bg-[#1f1f1f]/50 backdrop-blur-sm">
                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div className="space-y-1">
                                <label className="text-[#FFD700] text-xs font-bold uppercase tracking-widest ml-1">Username</label>
                                <input 
                                    type="text" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username" 
                                    className="w-full p-3.5 bg-[#0e0e0e] border border-white/5 rounded-xl outline-none focus:border-[#FFD700]/50 transition-all text-sm text-white"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[#FFD700] text-xs font-bold uppercase tracking-widest ml-1">Password</label>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password" 
                                    className="w-full p-3.5 bg-[#0e0e0e] border border-white/5 rounded-xl outline-none focus:border-[#FFD700]/50 transition-all text-sm text-white"
                                    required
                                />
                                <div className="flex justify-end">
                                    <button type="button" className="text-[10px] text-gray-500 hover:text-[#FFD700] transition-colors mt-2">Forgot Password?</button>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button type="submit" className="w-full bg-[#FFD700] text-black font-extrabold py-4 rounded-full border-2 border-[#FFD700] transition-all duration-300 hover:bg-transparent hover:text-[#FFD700] shadow-lg">
                                    Login
                                </button>
                            </div>
                            
                            <button type="button" className="w-full border border-gray-800 py-3.5 rounded-xl text-gray-400 text-[11px] font-bold hover:border-[#FFD700]/50 hover:text-white transition-all">
                                CONTINUE WITH GOOGLE
                            </button>

                            <p className="text-center text-sm text-gray-500 mt-6 font-medium">
                                New user ? <Link to="/signup" className="text-[#FFD700] font-black hover:underline ml-1">Sign Up</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;