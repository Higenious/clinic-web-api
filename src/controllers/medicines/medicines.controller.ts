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
export const addMedicineListBulk = async (
  req: Request<{}, {}, { medicines: { name: string; dosage?: string }[] }>,
  res: Response
) => {
  try {
    const { medicines } = req.body;

    if (!Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Medicines array is required and must contain at least one item.",
      });
    }
    const uniqueMedicines = Array.from(
  new Set(medicines.map(m => m.name.toLowerCase().trim()))
).map(name => ({ name }));

    const validMedicines = uniqueMedicines.filter(med => med.name?.trim());

    if (validMedicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Each medicine must have a valid name.",
      });
    }

    const inserted = await Medicine.insertMany(
      validMedicines.map(med => ({
        name: med.name.trim(),
        createdBy: "global",
      })),
      { ordered: false }
    );

    res.status(201).json({
      success: true,
      message: `${inserted.length} medicines added successfully.`,
      data: inserted,
    });
  } catch (error) {
    console.error("Error in addMedicineListBulk:", error);
    res.status(500).json({ success: false, message: "Server error while adding medicines." });
  }
};

/** Get all commont medicines list */
export const getAllCommonMedicines = async (req: Request, res: Response) => {
  try {
    const medicines = await Medicine.find({
      $or: [
        { createdBy: "global" },
        { hospitalId: req.query.hospitalId || null },
        { doctorId: req.query.doctorId || null }
      ],
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: medicines.map(m => m.name),
    });
  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.status(500).json({ success: false, message: "Server error while fetching medicines." });
  }
};
