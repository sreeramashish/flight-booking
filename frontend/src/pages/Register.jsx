import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/send-otp`, { email });
            setMessage(res.data.message);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP.');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(name, email, password, 'user', otp);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100"
            >
                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">Create Account</h2>
                {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-6 text-sm font-medium text-center">{error}</div>}
                {message && step === 2 && <div className="bg-green-50 text-green-600 p-3 rounded-xl mb-6 text-sm font-medium text-center">{message}</div>}
                
                {step === 1 ? (
                    <form onSubmit={handleSendOTP} className="space-y-5">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required 
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                            <input 
                                type="email" 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                            <input 
                                type="password" 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                                placeholder="••••••••"
                            />
                        </div>
                        <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-200">
                            Verify Email
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSignup} className="space-y-5">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Enter OTP</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 text-center text-2xl tracking-widest rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required 
                                maxLength={6}
                                placeholder="123456"
                            />
                            <p className="text-xs text-gray-400 mt-2 text-center">Check the backend console for the OTP.</p>
                        </div>
                        <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-200">
                            Create Account
                        </button>
                    </form>
                )}
                
                <p className="mt-6 text-center text-gray-600 text-sm">
                    Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:underline">Log in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
