import { Request, Response } from 'express';
import User from '../../models/User';
import Patient from '../../models/Patient';
import Hospital from '../../models/Hospital';

console.log('=========>admin controller');
// GET /admin/doctors
export const getDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await User.find({ role: 'doctor' });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching doctors' });
  }
};

// PATCH /admin/approve-user/:userId
export const approveUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isApproved: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User approved', user });
  } catch (err) {
    res.status(500).json({ message: 'Error approving user' });
  }
};

// GET /admin/patients/:doctorId
export const getPatientsByDoctor = async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  try {
    const patients = await Patient.find({ doctor: doctorId });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching patients' });
  }
};


export const createHospital = async (req: Request, res: Response) => {
  const { name, address } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: 'Hospital name is required' });
    }

    // 👇 Generate hospitalId
    let hospitalId = generateHospitalId(name);

    // Check for uniqueness and regenerate if needed
    while (await Hospital.findOne({ hospitalId })) {
      hospitalId = generateHospitalId(name);
    }

    const hospital = new Hospital({ name, address, hospitalId });
    await hospital.save();

    res.status(201).json({
      message: 'Hospital created successfully',
      hospital,
    });
  } catch (err) {
    console.error('Hospital creation failed:', err);
    res.status(500).json({ message: 'Failed to create hospital', error: err });
  }
};


function generateHospitalId(name: string): string {
  const firstWord = name.trim().split(' ')[0];
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
  return `HOSPI${firstWord}${randomDigits}`;
}


/** Medicines */

export const  getAllMedicinesLists =async(req: Request, res: Response)=>{
  try {
    console.log('Get All Medicines');
    
  } catch (error) {
    console.log('Error in getAllMedicinesLists', error)
    
  }
}