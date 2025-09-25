// controllers/doctor/visit.controller.ts
import Visit from '../../models/visit';
import Patient from '../../models/Patient';


export const addVisitNoteAndPrescription = async (req:any, res:any) => {
  try {
    const doctorId = req.user.id;
    const { patientId } = req.params;
    const { notes, prescription } = req.body;

    // Ensure patient exists and is assigned to doctor (optional check)
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const visit = await Visit.create({
      patient: patientId,
      doctor: doctorId,
      notes,
      prescription
    });

    res.status(201).json({ message: 'Visit note and prescription added', visit });
  } catch (err) {
    console.error('Error adding visit note', err);
    res.status(500).json({ message: 'Error adding visit data' });
  }
};
