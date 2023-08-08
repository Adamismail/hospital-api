const Patient = require('../models/patient');

// Patient registration
exports.registerPatient = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Check if the patient with the provided phone number already exists
    let patient = await Patient.findOne({ phoneNumber });

    if (!patient) {
      // If the patient doesn't exist, create a new patient record
      patient = new Patient({ phoneNumber });
      await patient.save();
    }

    res.status(201).json({ message: 'Patient registered successfully', patient });
  } catch (error) {
    console.error('Error in registering patient:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
