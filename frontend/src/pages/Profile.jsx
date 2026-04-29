import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Plane, Calendar, CreditCard, Ticket } from 'lucide-react';
import { format } from 'date-fns';

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchTravelHistory = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/bookings/my-bookings`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setBookings(res.data);
            } catch (_error) {
                console.error('Failed to fetch travel history', _error);
            }
        };

        if (!user) {
            navigate('/login');
        } else {
            fetchTravelHistory();
        }
    }, [user, navigate]);

    if (!user) return null;

    return (
        <div className="pt-24 min-h-screen bg-gray-50 px-4 pb-12">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Profile Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl flex items-center justify-between"
                >
                    <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center border-4 border-primary-50">
                            <User size={40} className="text-primary-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900">{user.name}</h2>
                            <p className="text-gray-500 font-medium">{user.email}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wide">
                                {user.role} Member
                            </span>
                        </div>
                    </div>
                    <button onClick={logout} className="px-6 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition">
                        Log Out
                    </button>
                </motion.div>

                {/* Travel History Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                        <Plane className="text-primary-500 mb-2" size={24} />
                        <h4 className="text-2xl font-bold text-gray-900">{bookings.length}</h4>
                        <p className="text-xs text-gray-500 uppercase font-bold">Total Flights</p>
                    </div>
                </div>

                {/* Travel History List */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl"
                >
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <Calendar className="mr-2 text-primary-500" /> Travel History
                    </h3>

                    {bookings.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <Ticket className="mx-auto text-gray-300 mb-3" size={32} />
                            <p className="text-gray-500 font-medium">You haven't booked any flights yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <div key={booking._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition">
                                    <div>
                                        <h4 className="font-bold text-gray-900">{booking.flightId?.airlineName || 'Unknown Airline'}</h4>
                                        <p className="text-sm text-gray-500 flex items-center mt-1">
                                            {booking.flightId?.source} → {booking.flightId?.destination}
                                        </p>
                                    </div>
                                    <div className="text-left md:text-right mt-3 md:mt-0">
                                        <p className="font-bold text-gray-900">{booking.flightId ? format(new Date(booking.flightId.departureTime), 'MMM dd, yyyy - HH:mm') : 'N/A'}</p>
                                        <p className="text-xs text-gray-400 font-medium mt-1">Seat {booking.seatNumber} • {booking.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
