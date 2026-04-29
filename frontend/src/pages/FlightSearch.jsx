import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Calendar, MapPin, Clock, IndianRupee, CreditCard, X, Loader, Armchair } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const FlightSearch = () => {
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [flights, setFlights] = useState([]);
    const [searched, setSearched] = useState(false);
    
    // Modal & Flow State
    const [modalOpen, setModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState('seat'); // 'seat' or 'payment'
    const [selectedFlightId, setSelectedFlightId] = useState(null);
    const [selectedSeat, setSelectedSeat] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!source || !destination || !date) return;
        try {
            const res = await axios.get(`${apiBase}/api/flights`, {
                params: { source, destination, date }
            });
            setFlights(res.data);
            setSearched(true);
        } catch (error) {
            console.error('Error fetching flights', error);
        }
    };

    const confirmBooking = (flightId) => {
        if (!user) {
            navigate('/login');
            return;
        }
        setSelectedFlightId(flightId);
        setSelectedSeat('');
        setModalStep('seat');
        setModalOpen(true);
    };

    const processPayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        
        setTimeout(async () => {
            try {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/bookings`, {
                    flightId: selectedFlightId,
                    seatNumber: selectedSeat || '12A', 
                    travelDate: date || new Date().toISOString()
                }, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setIsProcessing(false);
                setModalOpen(false);
                alert('Payment successful! Your flight is booked. Email Ticket Sent!');
                navigate('/my-bookings');
            } catch {
                setIsProcessing(false);
                alert('Booking failed after payment simulation.');
            }
        }, 2000);
    };

    // Generate dummy seats (Rows 1-6, A-F)
    const generateSeats = () => {
        const rows = [1, 2, 3, 4, 5, 6];
        const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
        return rows.map(r => (
            <div key={r} className="flex justify-center space-x-2 mb-2">
                {cols.map((c, i) => {
                    const seatId = `${r}${c}`;
                    const isOccupied = Math.random() < 0.2; // 20% random occupancy for demo
                    return (
                        <div key={seatId} className="flex">
                            {i === 3 && <div className="w-4"></div>} {/* Aisle */}
                            <button 
                                disabled={isOccupied}
                                onClick={() => !isOccupied && setSelectedSeat(seatId)}
                                className={`w-10 h-10 rounded-t-xl rounded-b flex items-center justify-center font-bold text-xs transition ${
                                    isOccupied ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 
                                    selectedSeat === seatId ? 'bg-primary-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-primary-100'
                                }`}
                            >
                                {seatId}
                            </button>
                        </div>
                    );
                })}
            </div>
        ));
    };

    return (
        <div className="pt-24 min-h-screen bg-gray-50 px-4 pb-12 relative">
            {/* Multi-Step Modal */}
            <AnimatePresence>
                {modalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative"
                        >
                            <button onClick={() => setModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                            
                            {modalStep === 'seat' ? (
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                                        <Armchair className="mr-3 text-primary-600" /> Select Seat
                                    </h3>
                                    <p className="text-gray-500 mb-6 text-sm">Choose your preferred seat. Selected: <strong>{selectedSeat || 'None'}</strong></p>
                                    
                                    <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 mb-6">
                                        <div className="w-16 h-4 bg-gray-300 rounded mx-auto mb-6"></div> {/* Cockpit indicator */}
                                        {generateSeats()}
                                    </div>
                                    
                                    <button 
                                        disabled={!selectedSeat}
                                        onClick={() => setModalStep('payment')} 
                                        className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center mt-4 ${selectedSeat ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                    >
                                        Proceed to Payment
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                                        <CreditCard className="mr-3 text-primary-600" /> Payment Details
                                    </h3>
                                    <p className="text-gray-500 mb-6 text-sm">Booking Seat <strong>{selectedSeat}</strong> via secure mock gateway.</p>
                                    
                                    <form onSubmit={processPayment} className="space-y-5">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-medium mb-1">Card Number</label>
                                            <input type="text" placeholder="1234 5678 9101 1121" required maxLength="16" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-gray-700 text-sm font-medium mb-1">Expiry Date</label>
                                                <input type="text" placeholder="MM/YY" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 text-sm font-medium mb-1">CVC</label>
                                                <input type="password" placeholder="123" required maxLength="4" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
                                            </div>
                                        </div>
                                        <button type="submit" disabled={isProcessing} className="w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition flex items-center justify-center mt-4 shadow-lg">
                                            {isProcessing ? <><Loader className="animate-spin mr-2" size={20} /> Processing...</> : `Pay & Confirm Seat ${selectedSeat}`}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-5xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-10"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <Plane className="mr-3 text-primary-600" />
                        Find Your Flight
                    </h2>
                    <form onSubmit={handleSearch} className="grid md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">From</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                                    value={source}
                                    onChange={(e) => setSource(e.target.value)}
                                    placeholder="Source City"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">To</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="Destination City"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Departure Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input 
                                    type="date" 
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex items-end">
                            <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-200">
                                Search Flights
                            </button>
                        </div>
                    </form>
                </motion.div>

                {searched && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Available Flights</h3>
                        {flights.length === 0 ? (
                            <div className="bg-white p-10 rounded-3xl text-center shadow-sm border border-gray-100">
                                <Plane className="mx-auto text-gray-300 mb-4" size={48} />
                                <p className="text-gray-500 text-lg">No flights found for this route.</p>
                            </div>
                        ) : (
                            flights.map((flight, index) => {
                                // Simulate AI Recommendation: E.g., the cheapest flight or first flight gets the badge
                                const isAiRecommended = index === 0;

                                return (
                                    <motion.div 
                                        whileHover={{ y: -5 }}
                                        key={flight._id} 
                                        className={`bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row items-center justify-between relative ${isAiRecommended ? 'border-2 border-primary-400' : 'border border-gray-100'}`}
                                    >
                                        {isAiRecommended && (
                                            <div className="absolute -top-4 left-6 bg-gradient-to-r from-primary-500 to-primary-700 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-md">
                                                <span>✨ AI Recommended Value</span>
                                            </div>
                                        )}
                                        <div className="flex-1 w-full md:w-auto mb-6 md:mb-0 mt-3 md:mt-0">
                                            <h4 className="text-xl font-bold text-cyan-900 mb-4">{flight.airlineName}</h4>
                                            <div className="flex items-center justify-between md:justify-start md:space-x-12">
                                                <div className="text-center md:text-left">
                                                    <p className="text-2xl font-bold text-gray-900">{format(new Date(flight.departureTime), 'HH:mm')}</p>
                                                    <p className="text-gray-500 text-sm font-medium">{flight.source}</p>
                                                </div>
                                                <div className="flex flex-col items-center px-4 w-1/3 md:w-auto">
                                                    <p className="text-xs text-gray-400 mb-1 flex items-center"><Clock size={12} className="mr-1"/> Direct</p>
                                                    <div className="w-full h-px bg-gray-300 relative my-1">
                                                        <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-500" size={16} />
                                                    </div>
                                                </div>
                                                <div className="text-center md:text-right">
                                                    <p className="text-2xl font-bold text-gray-900">{format(new Date(flight.arrivalTime), 'HH:mm')}</p>
                                                    <p className="text-gray-500 text-sm font-medium">{flight.destination}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8 flex flex-col items-center justify-center">
                                            <p className="text-3xl font-extrabold text-gray-900 mb-4 flex items-center">
                                                <IndianRupee size={24} className="mr-1"/>{flight.price}
                                            </p>
                                            <button 
                                                onClick={() => confirmBooking(flight._id)}
                                                className="w-full md:w-32 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-green-200"
                                            >
                                                Book
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default FlightSearch;
