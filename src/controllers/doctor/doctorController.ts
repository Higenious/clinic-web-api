import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../../models/User';
import Patient from '../../models/Patient';
import { generateToken } from '../../middlewares/auth.middleware';
import Hospital from '../../models/Hospital';

export const registerDoctor = async (req: Request, res: Response) => {
  const { name, email, password, hospitalId: hospitalCode } = req.body;

  try {
    // Validate password here if needed...

    // Check if doctor already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Doctor already exists' });
    }

    // ✅ Look up hospital by custom ID
    const hospital = await Hospital.findOne({ hospitalId: hospitalCode });
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found with code ' + hospitalCode });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const doctor = await User.create({
      name,
      email,
      passwordHash,
      role: 'doctor',
      hospitalId: hospital._id,  // ✅ Use actual Mongo ObjectId
      isApproved: false,
    });

    const token = generateToken({ email: email, role: doctor.role });

    return res.status(201).json({
      message: 'Registration succeeded',
      token,
      user: doctor,
    });

  } catch (err) {
    console.error('Doctor registration error:', err);
    res.status(500).json({ message: 'Registration failed', error: err });
  }
};


  

/** get patient */
export const getPatients = async (req: Request, res: Response) => {
    try {
      const doctorId = (req.user as any).id;
      const patients = await Patient.find({ doctor: doctorId });
      res.json(patients);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching patients' });
    }
  };  


  export const addPatientNote = async (req: any, res: any) => {
    try {
      const doctorId = req.user.id;
      const patientId = req.params.id;
      const { content } = req.body;
  
      const patient = await Patient.findById(patientId);
      if (!patient) return res.status(404).json({ message: 'Patient not found' });
  
      patient.notes.push({ doctor: doctorId, content });
      await patient.save();
  
      res.status(201).json({ message: 'Note added', notes: patient.notes });
    } catch (error) {
      console.error('Error adding note:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };



  export const addPrescription = async (req: any, res: any) => {
    try {
      const doctorId = req.user.id;
      const patientId = req.params.id;
      const { medications, instructions } = req.body;
  
      const patient = await Patient.findById(patientId);
      if (!patient) return res.status(404).json({ message: 'Patient not found' });
  
      patient.prescriptions.push({ doctor: doctorId, medications, instructions });
      await patient.save();
  
      res.status(201).json({ message: 'Prescription added', prescriptions: patient.prescriptions });
    } catch (error) {
      console.error('Error adding prescription:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  