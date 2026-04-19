const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const nodemailer = require('nodemailer');

const sendOTP = async (req, res) => {
    const { email } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
        await OTP.create({ email, otp: otpCode });
        
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'SkyBooker - Your Verification OTP',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                        <h2 style="color: #0ea5e9;">Welcome to SkyBooker!</h2>
                        <p>Use the following OTP to complete your registration. It is valid for 5 minutes.</p>
                        <h1 style="font-size: 36px; letter-spacing: 5px; color: #333; background: #f3f4f6; padding: 10px; border-radius: 10px; display: inline-block;">${otpCode}</h1>
                        <p>If you didn't request this, you can safely ignore this email.</p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'OTP sent to your email successfully!' });
        } else {
            console.log(`\n\n[DEV MODE] OTP for ${email} is: ${otpCode}\n\n`);
            res.status(200).json({ message: 'Email config missing. Check server console for OTP (Dev Mode)!' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const registerUser = async (req, res) => {
    const { name, email, password, role, otp } = req.body;
    try {
        const otpRecord = await OTP.findOne({ email, otp }).sort({ createdAt: -1 });
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = await User.create({
            name, email, password: hashedPassword, role
        });
        
        await OTP.deleteMany({ email }); // Clear OTPs after successful registration

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, sendOTP };
