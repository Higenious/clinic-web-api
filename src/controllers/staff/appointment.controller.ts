// controllers/staff/patient.controller.ts
import Appointment from '../../models/Appointment';
import Patient from '../../models/Patient';

export const addPatient = async (req:any, res:any) => {
  try {
    const { name, email, phone, dob, gender, address, doctorId } = req.body;

    const patient = await Patient.create({
      name,
      email,
      phone,
      dob,
      gender,
      address,
      doctor: doctorId
    });

    res.status(201).json({ message: 'Patient added', patient });
  } catch (err) {
    console.error('Error adding patient', err);
    res.status(500).json({ message: 'Error adding patient' });
  }
};


/** Make appointment for today */
export const makeAppointment = async (req: any, res: any) => {
    try {
      const { patientId, doctorId, date, reason } = req.body;
  
      const appointment = await Appointment.create({
        patient: patientId,
        doctor: doctorId,
        date,
        reason
      });
  
      res.status(201).json({ message: 'Appointment created', appointment });
    } catch (error) {
      console.log('Error while making appointment for today', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

/** Make all todays appointment */
export const getTodayAppointment = async (req: any, res: any) => {
    try {
      const doctorId = req.user.id; // assuming user is added by `authMiddleware`
  
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
  
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
  
      const appointments = await Appointment.find({
        doctor: doctorId,
        date: { $gte: todayStart, $lte: todayEnd },
      }).populate('patient');
  
      res.status(200).json({ appointments });
    } catch (error) {
      console.log('Error fetching today’s appointments', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

