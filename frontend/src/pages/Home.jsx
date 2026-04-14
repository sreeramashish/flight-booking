import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, Calendar, Search, ShieldCheck } from 'lucide-react';

const Home = () => {
    return (
        <div className="pt-20 min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-primary-600 h-[600px] overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop" 
                        alt="Flight" 
                        className="w-full h-full object-cover opacity-30 mix-blend-overlay"
                    />
                </div>
                <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight"
                    >
                        Explore the World <br/> with Ease
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl"
                    >
                        Find and book the best flights to your favorite destinations. Premium experience, seamless booking.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <Link to="/search" className="bg-white text-primary-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transform hover:-translate-y-1">
                            Search Flights Now
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto py-24 px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why choose SkyBooker?</h2>
                    <p className="text-lg text-gray-600">We provide a premium booking experience with exclusive benefits.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-12">
                    <motion.div whileHover={{ y: -10 }} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <div className="bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-primary-600">
                            <Search size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Search</h3>
                        <p className="text-gray-600 leading-relaxed">Find multi-city or round-trip flights with our intuitive search engine optimized for best rates.</p>
                    </motion.div>
                    <motion.div whileHover={{ y: -10 }} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <div className="bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-primary-600">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Booking</h3>
                        <p className="text-gray-600 leading-relaxed">Your data and payments are protected with enterprise-grade security and encryption.</p>
                    </motion.div>
                    <motion.div whileHover={{ y: -10 }} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <div className="bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-primary-600">
                            <Calendar size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Flexible Dates</h3>
                        <p className="text-gray-600 leading-relaxed">Change your plans with ease using our flexible ticket options and instant cancellations.</p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Home;
