import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Ticket, PlaneTakeoff, Armchair, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchBookings = async () => {
            if (user) {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/bookings/mybookings`, {
                        headers: { Authorization: `Bearer ${user.token}` }
                    });
                    setBookings(res.data);
                } catch (error) {
                    console.error('Error fetching bookings', error);
                }
            }
        };
        fetchBookings();
    }, [user]);

    if (!user) return <div className="pt-32 text-center">Please login to view your bookings.</div>;

    return (
        <div className="pt-32 min-h-screen bg-gray-50 px-4 pb-12">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight flex items-center">
                    <Ticket className="mr-3 text-primary-600" size={32} />
                    My Boarding Passes
                </h2>
                {bookings.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-gray-100">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Ticket className="text-gray-300" size={48} />
                        </div>
                        <p className="text-gray-500 text-lg mb-6">You don't have any upcoming flights.</p>
                        <Link to="/search" className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-full transition">
                            Book a Flight
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.filter(booking => booking.flightId).map(booking => (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={booking._id} 
                                className="bg-white rounded-3xl shadow-xl overflow-hidden relative border border-gray-100"
                            >
                                {/* Decorative elements for boarding pass look */}
                                <div className="absolute top-0 bottom-0 left-[75%] border-l-2 border-dashed border-gray-200 hidden md:block"></div>
                                <div className="absolute -top-4 left-[75%] w-8 h-8 bg-gray-50 rounded-full hidden md:block transform -translate-x-1/2"></div>
                                <div className="absolute -bottom-4 left-[75%] w-8 h-8 bg-gray-50 rounded-full hidden md:block transform -translate-x-1/2"></div>

                                        <div className="flex flex-col md:flex-row">
                                            <div className="p-8 w-full md:w-3/4">
                                                <div className="flex justify-between items-center mb-6">
                                                    <span className="bg-primary-100 text-primary-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                                                        {booking.status}
                                                    </span>
                                                    <span className="text-gray-500 text-sm font-medium">Booking ID: {booking._id.substring(0, 8).toUpperCase()}</span>
                                                </div>
                                                
                                                <div className="flex items-center justify-between mb-8">
                                                    <div>
                                                        <p className="text-4xl font-black text-gray-900">{booking.flightId.source.substring(0,3).toUpperCase()}</p>
                                                        <p className="text-gray-500 mt-1">{booking.flightId.source}</p>
                                                        <p className="text-xl font-bold mt-2">{format(new Date(booking.flightId.departureTime), 'HH:mm')}</p>
                                                    </div>
                                                    
                                                    <div className="flex-1 px-8 relative flex flex-col items-center">
                                                        <div className="w-full h-px bg-gray-300"></div>
                                                        <PlaneTakeoff className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-500 bg-white px-2" size={32} />
                                                        <p className="mt-4 text-xs text-gray-400 font-medium">{format(new Date(booking.flightId.departureTime), 'MMM dd, yyyy')}</p>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="text-4xl font-black text-gray-900">{booking.flightId.destination.substring(0,3).toUpperCase()}</p>
                                                        <p className="text-gray-500 mt-1">{booking.flightId.destination}</p>
                                                            <p className="text-xl font-bold mt-2">{format(new Date(booking.flightId.arrivalTime), 'HH:mm')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-gray-50 p-8 w-full md:w-1/4 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 relative z-10">
                                                <div className="mb-6">
                                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1 flex items-center"><Navigation size={12} className="mr-1"/> Flight</p>
                                                    <p className="text-lg font-bold text-gray-900 leading-none">{booking.flightId.airlineName}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1 flex items-center"><Armchair size={12} className="mr-1"/> Seat</p>
                                                    <p className="text-2xl font-black text-primary-600 leading-none">{booking.seatNumber}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Simulated Live Tracking */}
                                        <div className="bg-white px-8 py-4 border-t border-dashed border-gray-200">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold text-gray-500 uppercase flex items-center tracking-wider"><PlaneTakeoff size={14} className="mr-1"/> Live Tracking Simulation</span>
                                                <span className="text-xs font-bold text-green-600 uppercase tracking-wider flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></span> On Time</span>
                                            </div>
                                            <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden mt-3">
                                                <div 
                                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full" 
                                                    style={{ width: `${(booking._id.charCodeAt(0) % 60) + 20}%` }} // Deterministic simulated progress
                                                ></div>
                                            </div>
                                            <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                <span>Departed</span>
                                                <span>In Air</span>
                                                <span>Landed</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bookings;
