import { Request, Response } from 'express';
import { Medicine, IMedicine } from '../../models/medicines'; 
import { FilterQuery } from 'mongoose'; // <-- ADDED: Import FilterQuery to handle Mongoose operators

// Interface for the request body when adding a new medicine
interface AddMedicineBody {
  name: string;
  dosage?: string;
  hospitalId: string;
  doctorId?: string;
}

// Interface for query parameters when fetching the list
interface GetMedicineQuery {
  hospitalId?: string;
  doctorId?: string;
}


export const getAllMedicinesLists = async (req: Request<{}, {}, {}, GetMedicineQuery>, res: Response) => {
 console.log('Get all Medicines====>');
    try {
    const { doctorId, hospitalId } = req.query;

    if (!doctorId && !hospitalId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Must provide either doctorId or hospitalId for filtering.' 
      });
    }

    // FIX: Changed type to FilterQuery<IMedicine> to allow $or and $exists operators
    const filter: FilterQuery<IMedicine> = {};

    if (doctorId) {
      // If doctorId is provided, fetch medicines specific to the doctor AND medicines linked only to the hospital
      filter.$or = [
          { doctorId: doctorId },
          // Include medicines that are general hospital stock (doctorId is null/undefined)
          { doctorId: { $exists: false }, hospitalId: hospitalId }
      ];
    } else if (hospitalId) {
      // If only hospitalId is provided, fetch all common medicines for that hospital
      filter.hospitalId = hospitalId;
    }

    const medicines = await Medicine.find(filter)
      .select('-__v -updatedAt') // Exclude internal MongoDB fields
      .sort({ name: 1 }); // Sort alphabetically

    console.log(`Fetched ${medicines.length} medicines.`);
    
    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines,
    });
    
  } catch (error) {
    console.error('Error in getAllMedicinesLists:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching medicines list.' });
  }
};

/**
 * @route POST /api/medicines
 * @desc Add a new medicine to the list (requires hospitalId)
 */
export const addMedicineLists = async (req: Request<{}, {}, AddMedicineBody>, res: Response) => {
  try {
    const { name, dosage, hospitalId, doctorId } = req.body;

    if (!name || !hospitalId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Medicine name and hospitalId are required.' 
      });
    }

    const newMedicine = new Medicine({
      name,
      dosage: dosage || 'Not Specified',
      hospitalId,
      doctorId,
    });

    await newMedicine.save();
    
    console.log(`New medicine added: ${name}`);

    res.status(201).json({
      success: true,
      message: 'Medicine successfully added to list.',
      data: newMedicine,
    });

  } catch (error) {
    // Handle Mongoose validation errors
    if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
        return res.status(400).json({ success: false, message: error.message });
    }
    
    console.error('Error in addMedicineLists:', error);
    res.status(500).json({ success: false, message: 'Server error while adding medicine.' });
  }
};
