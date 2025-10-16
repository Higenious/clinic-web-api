// controllers/staff/patient.controller.ts
import mongoose from "mongoose";
import { Appointment } from "../../models/Appointment";
import Patient from "../../models/Patient";
import logger from "../../utils/logger";
import AWS from "aws-sdk";
import Visit from "../../models/visit";
import User from "../../models/User";
import { Request, Response } from "express";
import { sendWhatsAppMessage } from "../../utils/sendWhatsAppMessage";
//import { sendSmsMessage } from "../..//utils/snsService"; 
import { toZonedTime } from "date-fns-tz";
import { startOfDay,format, endOfDay } from 'date-fns'; 
import { parseISO } from 'date-fns/parseISO';
import moment from "moment-timezone";

interface PopulatedAppointment extends Document {
  patient: { name: string };
  doctor: { name: string };
  hospital: { name: string };
  date: Date;
  reason: string;
}

interface PatientDetails {
  name: string;
  phone: string; // Unique identifier for lookup
  email?: string;
  age?: number;
  gender?: string;
  dob?: Date;
  address?: string;
}

/**
 * Interface for the request body of makeAppointment
 */
interface MakeAppointmentBody {
  patientDetails: PatientDetails;
  doctorId: mongoose.Types.ObjectId;
  hospitalId: mongoose.Types.ObjectId;
  date: Date;
  reason: string;
  visitType: {
    type: String;
    enum: ["New Patient", "Follow-up", "Consultation"];
    default: ["New Patient"];
  };
  bp?: string; // Optional Blood Pressure
  sugar?: string; // Optional Blood Sugar
  weight?: number; // Optional Weight
}


AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const sns = new AWS.SNS();

// --- Direct SMS function ---
export const sendSmsMessage = async (phone: string, message: string) => {
  try {
    // Ensure E.164 format
    const phoneE164 = phone.startsWith("+") ? phone : `+91${phone}`;

    const params = {
      Message: message,
      PhoneNumber: phoneE164,
      MessageAttributes: {
        "AWS.SNS.SMS.SenderID": {
          DataType: "String",
          StringValue: "MediPanels", // your approved sender ID
        },
        "AWS.SNS.SMS.SMSType": {
          DataType: "String",
          StringValue: "Transactional",
        },
      },
    };

    const result = await sns.publish(params).promise();
    console.log("✅ SMS sent:", result.MessageId);
    return result;
  } catch (err) {
    console.error("❌ SNS SMS error:", err);
    throw err;
  }
};

export const addPatient = async (req: any, res: any) => {
  try {
    const { name, email, phone, dob, gender, address, doctorId } = req.body;

    const patient = await Patient.create({
      name,
      email,
      phone,
      dob,
      gender,
      address,
      doctor: doctorId,
    });

    res.status(201).json({ message: "Patient added", patient });
  } catch (err) {
    console.error("Error adding patient", err);
    res.status(500).json({ message: "Error adding patient" });
  }
};

/** Make appointment for today */
export const makeAppointment = async (
  req: Request<{}, {}, any>,
  res: Response
) => {
  console.log("📅 Attempting to make new appointment...");

  try {
    const {
      patientDetails,
      doctorId,
      hospitalId,
      date,
      visitType,
      bp,
      sugar,
      weight,
      messageType = "whatsapp",
    } = req.body;

    // --- 1. Basic Validation ---
    if (!patientDetails || !patientDetails.name || !patientDetails.phone) {
      return res.status(400).json({
        message: "Patient name and mobile number are required in patientDetails.",
      });
    }
    if (!doctorId || !hospitalId || !date) {
      return res.status(400).json({
        message: "Doctor ID, Hospital ID, and Date are required.",
      });
    }

    // --- 2. Create or Update Patient ---
    let patient = await Patient.findOne({ phone: patientDetails.phone });

    if (!patient) {
      console.log(`🧍 New Patient: ${patientDetails.name}`);
      patient = await Patient.create({
        name: patientDetails.name,
        phone: patientDetails.phone,
        email: patientDetails.email,
        age: patientDetails.age,
        gender: patientDetails.gender,
        dob: patientDetails.dob,
        address: patientDetails.address,
        doctor: doctorId,
      });
    } else {
      console.log(`✅ Existing Patient found: ${patient._id}`);
      await Patient.updateOne(
        { _id: patient._id },
        {
          $set: {
            name: patientDetails.name,
            ...(patientDetails.email ? { email: patientDetails.email } : {}),
          },
        }
      );
    }

    // --- 3. Normalize Date in UTC ---
    const appointmentDateUTC = moment.utc(parseISO(date)); // always stored in UTC

    const dayStartUTC = appointmentDateUTC.clone().startOf("day").toDate();
    const dayEndUTC = appointmentDateUTC.clone().endOf("day").toDate(); 

    // --- Find last token for the same UTC day ---
    const lastAppointment = await Appointment.findOne({
      doctor: doctorId,
      hospitalId,
      date: { $gte: dayStartUTC, $lte: dayEndUTC },
    }).sort({ tokenNumber: -1 });

    const nextTokenNumber = (lastAppointment?.tokenNumber || 0) + 1;

    // --- 5. Create Appointment ---
    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctorId,
      hospitalId: hospitalId,
       date: appointmentDateUTC.toDate(),
      visitType,
      bp,
      sugar,
      weight,
      tokenNumber: nextTokenNumber,
    });

    // --- 6. Send WhatsApp Message (Optional) ---
  
      const appointmentResult = await Appointment.findById(appointment._id)
        .populate("doctor", "name email")
        .populate("hospitalId", "name address");

      const doctorName = (appointmentResult?.doctor as any)?.name || "Doctor";
      const hospitalName =
        (appointmentResult?.hospitalId as any)?.name || "Hospital";

      const formattedDate = appointmentResult?.date
        ? format(new Date(appointmentResult.date), "dd MMM yyyy, hh:mm a")
        : "Unknown Date";

const message = `
👩‍⚕️ *Hello ${patientDetails.name},*

✅ Your appointment is confirmed!

🏥 *Hospital:* ${hospitalName}  
👨‍⚕️ *Doctor:* ${doctorName}  
📅 *Date & Time:* ${formattedDate}  
🔢 *Token No:* ${appointmentResult?.tokenNumber}

✨ Please arrive *15 minutes early*.  
Thank you for choosing *MediPanels*.  
Wishing you good health! 🌿
`;

    try {
    if (messageType === "sms") {
      const phoneE164 = patientDetails.phone.startsWith("+")
        ? patientDetails.phone
        : `+91${patientDetails.phone}`;
     console.log('phoneE164======>', phoneE164);   
      await sendSmsMessage(phoneE164, message);
    } else if (messageType === "whatsapp") {
      await sendWhatsAppMessage(patientDetails.phone, message);
    }
    } catch (notifyError) {
      console.error("❌ Notification sending failed:", notifyError);
    }


    // --- 7. Success Response ---
    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment,
      patientId: patient._id,
    });
  } catch (error: any) {
    console.error("❌ Error while making appointment:", error);
    if (error?.code === 11000) {
      return res.status(409).json({
        message: "A patient with this mobile number or email already exists.",
      });
    }
    res.status(500).json({
      message: "Internal server error while making appointment.",
    });
  }
};


/** Make all todays appointment */
export const getTodayAppointment = async (req: Request, res: Response) => {
  try {
    const { doctorId, hospitalId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(doctorId) ||
      !mongoose.Types.ObjectId.isValid(hospitalId)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid Doctor or Hospital ID format." });
    }

    // --- Use UTC time globally ---
     // --- Define "today" purely in UTC ---
 const startOfTodayUTC = moment.utc().startOf("day").toDate();
    const endOfTodayUTC = moment.utc().endOf("day").toDate();

    
       console.log(
      `🕒 Fetching Appointments (UTC): ${startOfTodayUTC.toISOString()} → ${endOfTodayUTC.toISOString()}`
    );
    // --- Fetch Appointments ---
    const appointments = await Appointment.find({
      doctor: doctorId,
      hospitalId,
      date: { $gte: startOfTodayUTC, $lte: endOfTodayUTC },
    })
      .populate("patient")
      .sort({ tokenNumber: 1 });

    console.log(
      `📋 Fetched ${appointments.length} appointments for Doctor: ${doctorId}`
    );
res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("Error fetching today’s appointments:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching appointments.",
    });
  }
};



/**Cancel appoitnment */

export const cancelAppointment = async (req: Request, res: Response) => {
  console.log('came in cancel ======>');
  try {
    const { appointmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res
        .status(400)
        .json({ message: "Invalid appointment ID format." });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "cancelled" },
      { new: true } // Return the updated document
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.status(200).json({
      message: "Appointment successfully cancelled.",
      appointment,
    });
  } catch (error) {
    console.error("Error canceling appointment:", error);
    res
      .status(500)
      .json({ message: "Internal server error while canceling appointment." });
  }
};

export const getPatientDetails = async (req: Request, res: Response) => {
  try {
    // Extract phone number from route parameters
    const { phone, doctorId, hospitalId } = req.params;

    // 1. Basic Validation
    // Note: The phone is a string parameter, but we validate the IDs
    if (
      !phone ||
      !mongoose.Types.ObjectId.isValid(doctorId) ||
      !mongoose.Types.ObjectId.isValid(hospitalId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Phone number, Doctor ID, and Hospital ID are required and must be valid.",
      });
    }

    // 2. Fetch the patient record using the unique phone number
    const patient = await Patient.findOne({ phone: phone });

    if (!patient) {
      console.log(`Patient not found for phone number: ${phone}`);
      return res
        .status(404)
        .json({ success: false, message: "Patient not found." });
    }

    // --- 3. Access Control and Logging ---
    // Since phone is globally unique, we successfully found the patient.
    // We use doctorId/hospitalId here to record who accessed the data.

    console.log(
      `Successfully fetched patient ${patient._id} details using phone ${phone} by doctor ${doctorId} at hospital ${hospitalId}`
    );

    res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    console.error("Error fetching patient details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching patient details.",
    });
  }
};

// Interface for the detailed prescription items
interface IPrescribedMedicine {
  medicine: string;
  quantity: string;
  dailyDose: string;
  timing: string; // e.g., Morning, Afternoon, Night
  howToTake: string; // e.g., Before Food, After Food
}

// Interface for the request body when finalizing a visit
interface IFinalizeVisitBody {
  doctorId: string;
  complaints: string; // Doctor's notes on symptoms
  bp?: string;
  sugar?: string;
  weight?: string;
  prescriptions: IPrescribedMedicine[]; // Array of structured medicines
  adviceGiven?: string; // General advice/instructions
}

/**
 * Finalizes an appointment:
 * 1. Updates the Patient's prescription history.
 * 2. Creates a permanent Visit record (archive).
 * 3. Marks the original Appointment as 'completed'.
 * @param req Expects appointmentId in params and structured data in body
 */
export const finalizeVisitAndPrescribe = async (
  req: Request,
  res: Response
) => {
  const { appointmentId } = req.params;
  const {
    doctorId,
    complaints,
    bp,
    sugar,
    weight,
    prescriptions,
    adviceGiven,
  }: IFinalizeVisitBody = req.body;

  // Simple validation
  if (
    !doctorId ||
    !complaints ||
    !prescriptions ||
    prescriptions.length === 0
  ) {
    return res.status(400).json({
      message:
        "Missing required visit details (doctorId, complaints, or prescriptions).",
    });
  }

  // Ensure all prescription items have necessary fields for the structured schema
  const isValidPrescriptions = prescriptions.every(
    (p) => p.medicine && p.quantity && p.dailyDose
  );
  if (!isValidPrescriptions) {
    return res.status(400).json({
      message:
        "Each prescription item must have medicine, quantity, and dailyDose.",
    });
  }



  try {
    // 1. Find the appointment and patient
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    if (
      appointment.status === "Cancelled" ||
      appointment.status === "Completed"
    ) {
      return res
        .status(400)
        .json({ message: `Appointment is already ${appointment.status}.` });
    }

    const patientId = appointment.patient;
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        message: "Patient record associated with this appointment not found.",
      });
    }

    // 2. Create the permanent Visit record (archive)
    const newVisit = new Visit({
      patient: patientId,
      doctor: new mongoose.Types.ObjectId(doctorId),
      hospitalId: appointment.hospitalId, // Use hospitalId from the appointment
      appointment: new mongoose.Types.ObjectId(appointmentId),
      date: new Date(),
      notes: complaints, // Symptoms/Complaints are the main notes
      prescription: prescriptions,
      bp: bp,
      sugar: sugar,
      weight: weight,
      adviceGiven: adviceGiven,
      //visitType: appointment?.visitType || 'Consultation', // Use appointment's type
    });

    await newVisit.save();

    // 3. Update Patient History (push prescription to patient's embedded array)
    const newPrescriptionEntry = {
      doctor: new mongoose.Types.ObjectId(doctorId),
      medications: prescriptions, // Array of structured objects
      instructions: adviceGiven,
      createdAt: new Date(),
    };

    patient.prescriptions.push(newPrescriptionEntry as any); // Use 'any' temporarily to satisfy TypeScript complexity
    await patient.save();

    // 4. Update the Appointment status to completed
    appointment.status = "Completed";
    await appointment.save();

    

res.status(200).json({
  status: "ok",
  message:
    "Visit finalized successfully. Prescription saved and appointment marked as completed.",
  data: {
    visitId: newVisit._id,
    appointmentId: appointment._id,
    patientId: patient._id,
  },
});

  } catch (error) {
    console.error("Error finalizing visit and adding prescription:", error);
    res
      .status(500)
      .json({ message: "Internal server error during visit finalization." });
  } finally {
  }
};
