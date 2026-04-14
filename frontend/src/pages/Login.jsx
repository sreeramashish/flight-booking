import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100"
            >
                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">Welcome Back</h2>
                {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-6 text-sm font-medium text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
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
                        Sign In
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600 text-sm">
                    Don't have an account? <Link to="/register" className="text-primary-600 font-bold hover:underline">Sign up</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
