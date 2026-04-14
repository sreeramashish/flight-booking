import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PlaneTakeoff, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-white shadow-md py-4 px-6 fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 text-primary-600 font-bold text-2xl tracking-tighter">
                    <PlaneTakeoff size={32} />
                    <span>SkyBooker</span>
                </Link>
                <div className="flex items-center space-x-6">
                    <Link to="/search" className="text-gray-600 hover:text-primary-600 transition duration-300 font-medium">Search Flights</Link>
                    {user ? (
                        <>
                            <Link to="/my-bookings" className="text-gray-600 hover:text-primary-600 transition duration-300 font-medium">My Bookings</Link>
                            <Link to="/profile" className="text-gray-600 hover:text-primary-600 transition duration-300 font-medium">Profile</Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="text-gray-600 hover:text-primary-600 transition duration-300 font-medium">Admin</Link>
                            )}
                            <button onClick={logout} className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition duration-300 font-medium">
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <div className="flex space-x-4">
                            <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium mt-2">Login</Link>
                            <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-full font-medium transition duration-300 shadow-sm hover:shadow">Sign up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
