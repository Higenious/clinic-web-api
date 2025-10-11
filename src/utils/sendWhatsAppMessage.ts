import twilio from "twilio";
import dotenv from "dotenv";
import logger from "./logger";

dotenv.config();

console.log('process.env.TWILIO_ACCOUNT_SID------------', process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);


export const sendWhatsAppMessage = async (to: any, message: any) => {
    console.log(`sendWhatsAppMessage = = = = =>'`, to, message);
  try {
    const normalized = to.startsWith("+") ? to : `+91${to}`;
    const response = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER, // Twilio sandbox number
      to: `whatsapp:${normalized}`,
      body: message,
      statusCallback: "https://your-server.com/api/twilio/status"
    });

    console.log("✅ WhatsApp message sent:", response.sid);
    return response;
  } catch (error) {
    console.error("❌ Error sending WhatsApp message:", error);
    throw error;
  }
};
