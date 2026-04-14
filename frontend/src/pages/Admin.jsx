import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert, PlusCircle, LayoutDashboard, Users, Calendar as CalendarIcon, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const Admin = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState('addFlight');
    
    // Add Flight States
    const [airlineName, setAirlineName] = useState('');
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [arrivalTime, setArrivalTime] = useState('');
    const [price, setPrice] = useState('');
    const [message, setMessage] = useState('');

    // View Bookings States
    const [bookings, setBookings] = useState([]);
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
        } else {
            fetchBookings();
        }
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/bookings', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setBookings(res.data);
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        }
    };

    const handleAddFlight = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/flights', {
                airlineName, source, destination, departureTime, arrivalTime, price
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setMessage('Flight added successfully!');
            setAirlineName(''); setSource(''); setDestination('');
            setDepartureTime(''); setArrivalTime(''); setPrice('');
        } catch (error) {
            setMessage('Failed to add flight.');
        }
    };

    const filteredBookings = filterDate 
        ? bookings.filter(b => format(new Date(b.flightId.departureTime), 'yyyy-MM-dd') === filterDate)
        : bookings;

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="pt-24 min-h-screen bg-gray-50 px-4 pb-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <LayoutDashboard className="text-primary-600 mr-3" size={32} />
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h2>
                    </div>
                </div>

                <div className="flex space-x-4 mb-6">
                    <button 
                        onClick={() => setActiveTab('addFlight')}
                        className={`px-6 py-3 rounded-full font-bold flex items-center transition ${activeTab === 'addFlight' ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        <PlusCircle size={18} className="mr-2" /> Add Flight
                    </button>
                    <button 
                        onClick={() => setActiveTab('viewBookings')}
                        className={`px-6 py-3 rounded-full font-bold flex items-center transition ${activeTab === 'viewBookings' ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Users size={18} className="mr-2" /> Customer Bookings
                    </button>
                </div>

                {activeTab === 'addFlight' && (
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden max-w-4xl">
                        <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 rounded-bl-xl text-sm font-bold flex items-center">
                            <ShieldAlert size={14} className="mr-1"/> Admin Mode
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <PlusCircle className="mr-2 text-primary-500" /> Publish Flight Schedule
                        </h3>
                        
                        {message && (
                            <div className={`p-4 rounded-xl mb-6 font-medium text-sm ${message.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {message}
                            </div>
                        )}
                        
                        <form onSubmit={handleAddFlight} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Airline Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" value={airlineName} onChange={(e) => setAirlineName(e.target.value)} required placeholder="e.g. Sky Airlines" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Price (INR)</label>
                                    <input type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="e.g. 5000" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Source</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" value={source} onChange={(e) => setSource(e.target.value)} required placeholder="Departure" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Destination</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" value={destination} onChange={(e) => setDestination(e.target.value)} required placeholder="Arrival" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Departure Time</label>
                                    <input type="datetime-local" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Arrival Time</label>
                                    <input type="datetime-local" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} required />
                                </div>
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="bg-primary-600 text-white py-3 px-8 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-200">
                                    Save Flight 
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'viewBookings' && (
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                                <Ticket className="mr-3 text-primary-600" /> Platform Reservations
                            </h3>
                            <div className="mt-4 md:mt-0 relative flex items-center">
                                <CalendarIcon className="absolute left-3 text-gray-400" size={18} />
                                <input 
                                    type="date" 
                                    className="pl-10 pr-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                />
                                {filterDate && (
                                    <button onClick={() => setFilterDate('')} className="ml-3 text-sm text-red-500 font-bold hover:underline">Clear</button>
                                )}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm tracking-wider uppercase">
                                        <th className="p-4 font-bold rounded-tl-xl">Customer</th>
                                        <th className="p-4 font-bold">Flight Route</th>
                                        <th className="p-4 font-bold">Date & Time</th>
                                        <th className="p-4 font-bold">Seat</th>
                                        <th className="p-4 font-bold rounded-tr-xl">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBookings.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-gray-500">No bookings found for the selected criteria.</td>
                                        </tr>
                                    ) : (
                                        filteredBookings.map(booking => (
                                            <tr key={booking._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                                <td className="p-4">
                                                    <p className="font-bold text-gray-900">{booking.userId?.name}</p>
                                                    <p className="text-xs text-gray-500">{booking.userId?.email}</p>
                                                </td>
                                                <td className="p-4">
                                                    <p className="font-bold text-primary-700">{booking.flightId?.airlineName}</p>
                                                    <p className="text-sm text-gray-600">{booking.flightId?.source} → {booking.flightId?.destination}</p>
                                                </td>
                                                <td className="p-4">
                                                    <p className="font-medium text-gray-900">{booking.flightId ? format(new Date(booking.flightId.departureTime), 'MMM dd, yyyy') : 'N/A'}</p>
                                                    <p className="text-sm text-gray-500">{booking.flightId ? format(new Date(booking.flightId.departureTime), 'HH:mm') : 'N/A'}</p>
                                                </td>
                                                <td className="p-4 font-bold text-gray-700">{booking.seatNumber}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
