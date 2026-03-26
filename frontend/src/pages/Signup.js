import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [showModal, setShowModal] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [strength, setStrength] = useState('');

    // Password Strength Check Logic
    useEffect(() => {
        const pass = formData.password;
        if (!pass) setStrength('');
        else if (pass.length < 6) setStrength('Weak 🔴');
        else if (pass.length < 10) setStrength('Medium 🟡');
        else setStrength('Strong 💪 🟢');
    }, [formData.password]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id.replace('signup-', '')]: e.target.value });
    };

    const handleSignup = async (e) => {
    e.preventDefault();
    
    // Validation: Password Match
    if (formData.password !== formData.confirmPassword) {
        setPasswordError("Passwords don't match, bhai!");
        return;
    }

    try {
        // --- YE WALI LINE CHANGE HOGI ---
        const res = await axios.post(`${API_URL}/api/signup`, {
            fullname: formData.fullname,
            email: formData.email,
            username: formData.username,
            password: formData.password
        });

        if (res.data.success) {
            setShowModal(true);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("currentUser", formData.username);
        } else {
            alert(res.data.message);
        }
    } catch (err) {
        alert("Signup failed! Backend ya Network check karo.");
    }
};;

    return (
        <div className="bg-[#0b0b0b] text-white min-h-screen font-sans selection:bg-[#FFD700] selection:text-black">
            
            {/* Success Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md transition-all">
                    <div className="bg-[#161616] border border-[#FFD700]/30 p-10 rounded-[30px] text-center max-w-sm w-full mx-4 shadow-[0_0_50px_rgba(255,215,0,0.1)]">
                        <div className="w-20 h-20 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black mb-2 uppercase">Success!</h2>
                        <p className="text-gray-400 text-sm mb-8">Account created successfully. Welcome to CyberShield Hub.</p>
                        <button onClick={() => navigate('/')} className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-full border-2 border-[#FFD700] hover:bg-transparent hover:text-[#FFD700] transition-all">
                            Let's Go
                        </button>
                    </div>
                </div>
            )}

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 md:px-20 py-6">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-8 h-8 bg-[#FFD700] rounded-lg flex items-center justify-center text-black font-black text-xl">C</div>
                    <span className="text-[#FFD700] text-2xl font-black tracking-tighter uppercase">CyberShield Hub</span>
                </div>
                <Link to="/login" className="bg-[#FFD700] text-black text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-full border-2 border-[#FFD700] hover:bg-transparent hover:text-[#FFD700] transition-all">
                    Login
                </Link>
            </nav>

            <main className="min-h-screen flex justify-center items-center pt-32 pb-10 px-4">
                <div className="flex flex-col md:flex-row w-full max-w-5xl bg-[#161616] rounded-[30px] overflow-hidden shadow-2xl border border-white/5">
                    {/* Left Branding Section */}
                    <div className="w-full md:w-5/12 p-12 md:p-16 flex flex-col justify-center bg-gradient-to-br from-[#1a1a1a] to-[#121212]">
                        <h1 className="text-5xl md:text-6xl font-black leading-[0.9] mb-6 tracking-tighter uppercase">
                            JOIN THE <br /> <span className="text-white/90">SHIELD</span>
                        </h1>
                        <p className="text-gray-500 text-sm leading-relaxed">Secure your world. One click at a time.</p>
                        <div className="mt-10 w-20 h-1 bg-[#FFD700] rounded-full opacity-50"></div>
                    </div>

                    {/* Form Section */}
                    <div className="w-full md:w-7/12 p-10 md:p-14 bg-[#1f1f1f]/50 backdrop-blur-sm">
                        <form className="space-y-4" onSubmit={handleSignup}>
                            <div className="space-y-1">
                                <label className="text-[#FFD700] text-[10px] font-bold uppercase tracking-widest ml-1">Full Name</label>
                                <input type="text" id="signup-fullname" onChange={handleChange} placeholder="Enter your name" className="w-full p-3 bg-[#0e0e0e] border border-white/5 rounded-xl outline-none focus:border-[#FFD700]/50 text-sm" required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[#FFD700] text-[10px] font-bold uppercase tracking-widest ml-1">Email</label>
                                    <input type="email" id="signup-email" onChange={handleChange} className="w-full p-3 bg-[#0e0e0e] border border-white/5 rounded-xl outline-none text-sm" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[#FFD700] text-[10px] font-bold uppercase tracking-widest ml-1">Username</label>
                                    <input type="text" id="signup-username" onChange={handleChange} className="w-full p-3 bg-[#0e0e0e] border border-white/5 rounded-xl outline-none text-sm" required />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[#FFD700] text-[10px] font-bold uppercase tracking-widest ml-1">
                                    Password {strength && <span className="ml-2 lowercase text-gray-400 italic">({strength})</span>}
                                </label>
                                <input type="password" id="signup-password" onChange={handleChange} className="w-full p-3 bg-[#0e0e0e] border border-white/5 rounded-xl outline-none text-sm" required />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[#FFD700] text-[10px] font-bold uppercase tracking-widest ml-1">Confirm Password</label>
                                <input type="password" id="signup-confirmPassword" onChange={handleChange} className="w-full p-3 bg-[#0e0e0e] border border-white/5 rounded-xl outline-none text-sm" required />
                                {passwordError && <p className="text-red-500 text-[10px] mt-1">{passwordError}</p>}
                            </div>

                            <button type="submit" className="w-full bg-[#FFD700] text-black font-extrabold py-4 rounded-full border-2 border-[#FFD700] transition-all hover:bg-transparent hover:text-[#FFD700] mt-4 shadow-lg active:scale-95">
                                Create Account
                            </button>

                            <p className="text-center text-xs text-gray-500 mt-4">
                                Already have an account? <Link to="/login" className="text-[#FFD700] font-black hover:underline ml-1">Login</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Signup;