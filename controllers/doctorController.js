const Doctor = require('../models/doctor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { SECRET_KEY } = require('../utils/constants');

// Doctor registration
exports.registerDoctor = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username is already taken
    const existingDoctor = await Doctor.findOne({ username });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new doctor
    const newDoctor = new Doctor({
      username,
      password: hashedPassword,
    });

    const savedDoctor = await newDoctor.save();

    res.status(201).json({ message: 'Doctor registered successfully', doctor: savedDoctor });
  } catch (error) {
    console.error('Error in registering doctor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Doctor login
exports.loginDoctor = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the doctor by username from Doctor DB
    const doctor = await Doctor.findOne({ username });
    if (!doctor) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare login passwords
    const passwordMatch = await bcrypt.compare(password, doctor.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT 
    const token = jwt.sign({ doctorId: doctor._id }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error in doctor login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
