import AWS from "aws-sdk";

// Configure AWS credentials & region
AWS.config.update({
  region: "us-east-1", // same region as your SNS topic
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const sns = new AWS.SNS();

export const sendSmsMessage = async (phone: string, message: string) => {
  try {
    const params = {
      Message: message,
      PhoneNumber: phone, // must be in E.164 format, e.g., +918237272743
      MessageAttributes: {
        "AWS.SNS.SMS.SenderID": {
          DataType: "String",
          StringValue: "MediPanels", // matches your topic Display Name
        },
        "AWS.SNS.SMS.SMSType": {
          DataType: "String",
          StringValue: "Transactional", // "Promotional" is also an option
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
