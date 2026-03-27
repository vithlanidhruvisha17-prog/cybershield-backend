import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false); // Success Modal State
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/api/login`, { username, password });
            if (res.data.success) {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("currentUser", res.data.user.username);
                setShowModal(true); // Login success par modal dikhao
            } else {
                alert("Ghalat details bhai!");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Can not connect with server");
        }
    };

    const handleGoogleLogin = () => {
        alert("Google Login functionality backend se connect karni hogi!");
    };

    const handleForgotPassword = () => {
        alert("Reset link aapki email par bhej diya gaya hai (Simulated)!");
    };

    return (
        <div className="bg-[#0b0b0b] text-white min-h-screen font-sans selection:bg-[#FFD700] selection:text-black">
            
            {/* Success Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md">
                    <div className="bg-[#161616] border border-[#FFD700]/30 p-10 rounded-[30px] text-center max-w-sm w-full mx-4 shadow-[0_0_50px_rgba(255,215,0,0.1)]">
                        <div className="w-20 h-20 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black mb-2 uppercase">Welcome Back!</h2>
                        <p className="text-gray-400 text-sm mb-8">Login Successful. Your shield is active.</p>
                        <button onClick={() => navigate('/report')} className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-full border-2 border-[#FFD700] hover:bg-transparent hover:text-[#FFD700] transition-all">
                            Let's Go
                        </button>
                    </div>
                </div>
            )}

            {/* UNIFIED HEADER */}
            <header className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="bg-[#FFD700] text-black w-10 h-10 flex items-center justify-center rounded-xl font-black text-2xl group-hover:scale-110 transition-transform">C</div>
                    <span className="text-[#FFD700] font-black text-xl md:text-2xl tracking-tighter uppercase">CYBERSHIELD HUB</span>
                </Link>
                <Link to="/signup" className="bg-[#FFD700] text-black px-8 py-2.5 rounded-full font-bold text-sm  transition-all shadow-lg">
                    SIGN UP
                </Link>
            </header>

            <main className="min-h-screen flex justify-center items-center pt-20 pb-10 px-4">
                <div className="flex flex-col md:flex-row w-full max-w-5xl bg-[#121212] rounded-[35px] overflow-hidden shadow-2xl border border-white/5">
                    <div className="w-full md:w-5/12 p-12 md:p-16 flex flex-col justify-center bg-gradient-to-br from-[#1a1a1a] to-[#121212]">
                        <h1 className="text-5xl md:text-6xl font-black leading-[0.9] mb-6 tracking-tighter uppercase">CYBER <br /> SECURITY</h1>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-[260px]">A Platform to Report, Analyze & Prevent Cyber Threats</p>
                    </div>

                    <div className="w-full md:w-7/12 p-10 md:p-14 bg-[#1f1f1f]/50 backdrop-blur-sm">
                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div className="space-y-1">
                                <label className="text-[#FFD700] text-xs font-bold uppercase tracking-widest ml-1">Username</label>
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full p-3.5 bg-[#0e0e0e] border border-white/5 rounded-xl outline-none focus:border-[#FFD700]/50 text-sm text-white" required />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[#FFD700] text-xs font-bold uppercase tracking-widest ml-1">Password</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full p-3.5 bg-[#0e0e0e] border border-white/5 rounded-xl outline-none focus:border-[#FFD700]/50 text-sm text-white" required />
                                <div className="flex justify-end">
                                    <button type="button" onClick={handleForgotPassword} className="text-[10px] text-gray-500 hover:text-[#FFD700] mt-2">Forgot Password?</button>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-[#FFD700] text-black font-extrabold py-4 rounded-full border-2 border-[#FFD700] hover:bg-transparent hover:text-[#FFD700] transition-all shadow-lg">Login</button>
                            
                            <GoogleLogin
  onSuccess={credentialResponse => {
    console.log(credentialResponse);
    // Is credentialResponse.credential ko backend bhejo verify karne ke liye
  }}
  onError={() => {
    console.log('Login Failed');
  }}
/>

                            <p className="text-center text-sm text-gray-500 mt-6 font-medium">New user ? <Link to="/signup" className="text-[#FFD700] font-black hover:underline ml-1">Sign Up</Link></p>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default Login;