const User = require('../models/User');
const Booking = require('../models/Booking');
const Ticket = require('../models/Ticket');

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete your own admin account' });
        }

        const bookings = await Booking.find({ userId: user._id });
        const bookingIds = bookings.map(b => b._id);

        await Ticket.deleteMany({ bookingId: { $in: bookingIds } });
        await Booking.deleteMany({ userId: user._id });
        await User.deleteOne({ _id: user._id });

        res.json({ message: 'User deleted and associated bookings removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUsers, deleteUser };