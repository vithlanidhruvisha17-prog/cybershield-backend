import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config'; 

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); 
    const navigate = useNavigate();

    const handleSendOTP = async () => {
        try {
            // ✅ Ab ye config wali link use karega
            const res = await axios.post(`${API_URL}/api/forgot-password`, { email });
            if (res.data.success) {
                alert("OTP aapki email par bhej diya gaya hai!");
                setStep(2);
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Kuch gadbad ho gayi! Server check karo.");
        }
    };

    const handleResetPassword = async () => {
        try {
            // ✅ Yahan bhi API_URL set kar diya hai
            const res = await axios.post(`${API_URL}/api/reset-password`, { email, otp, newPassword });
            if (res.data.success) {
                alert("Password badal gaya! Ab login karo.");
                navigate('/login');
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            alert("Reset fail ho gaya!");
        }
    };

    return (
        <div className="bg-[#000] min-h-screen flex justify-center items-center text-white font-sans">
            <div className="bg-[#1a1a1a] p-10 rounded-[20px] w-full max-w-[400px] border border-white/10 text-center shadow-2xl">
                <h2 className="text-[#FFD700] text-2xl font-black mb-6 uppercase tracking-tighter">
                    {step === 1 ? 'Reset Shield Access' : 'Enter OTP'}
                </h2>
                
                {step === 1 ? (
                    <div className="space-y-5">
                        <input 
                            type="email" placeholder="Apni Email dalo" 
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3.5 bg-[#333] border-none rounded-xl outline-none text-white focus:ring-2 focus:ring-[#FFD700]/50"
                        />
                        <button onClick={handleSendOTP} className="w-full py-3.5 bg-[#FFD700] text-black font-black rounded-xl hover:scale-[1.02] transition-transform">
                            SEND OTP
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <input 
                            type="text" placeholder="6-Digit OTP" 
                            value={otp} onChange={(e) => setOtp(e.target.value)}
                            className="w-full p-3.5 bg-[#333] border-none rounded-xl outline-none text-white focus:ring-2 focus:ring-[#FFD700]/50"
                        />
                        <input 
                            type="password" placeholder="Naya Password" 
                            value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-3.5 bg-[#333] border-none rounded-xl outline-none text-white focus:ring-2 focus:ring-[#FFD700]/50"
                        />
                        <button onClick={handleResetPassword} className="w-full py-3.5 bg-[#FFD700] text-black font-black rounded-xl hover:scale-[1.02] transition-transform">
                            UPDATE PASSWORD
                        </button>
                    </div>
                )}
                <p onClick={() => navigate('/login')} className="mt-6 text-sm text-gray-500 cursor-pointer hover:text-[#FFD700] transition-colors font-bold uppercase tracking-widest">
                    Back to Login
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;