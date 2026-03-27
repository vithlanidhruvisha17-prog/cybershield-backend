import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP/New Pass

    const handleSendOTP = async () => {
        const res = await axios.post(`${API_URL}/api/forgot-password`, { email });
        if(res.data.success) setStep(2);
        else alert(res.data.message);
    };

    const handleResetPassword = async () => {
        const res = await axios.post(`${API_URL}/api/reset-password`, { email, otp, newPassword });
        if(res.data.success) {
            alert("Password Changed Successfully!");
            // Redirect to login
        }
    };

    return (
        <div className="bg-[#161616] p-8 rounded-[30px] border border-[#FFD700]/20 max-w-md mx-auto mt-20">
            <h2 className="text-[#FFD700] text-2xl font-black mb-6 uppercase">Reset Shield</h2>
            
            {step === 1 ? (
                <div className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="Enter Registered Email" 
                        className="w-full p-3 bg-[#0e0e0e] border border-white/5 rounded-xl outline-none"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={handleSendOTP} className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-full">SEND OTP</button>
                </div>
            ) : (
                <div className="space-y-4">
                    <input type="text" placeholder="6-Digit OTP" className="w-full p-3 bg-[#0e0e0e] rounded-xl outline-none" onChange={(e) => setOtp(e.target.value)} />
                    <input type="password" placeholder="New Password" className="w-full p-3 bg-[#0e0e0e] rounded-xl outline-none" onChange={(e) => setNewPassword(e.target.value)} />
                    <button onClick={handleResetPassword} className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-full">UPDATE PASSWORD</button>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;