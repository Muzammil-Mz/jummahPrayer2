import twilio from "twilio";
import config from "config";

const accountSid = config.get("TWILIO_SID");
const authToken = config.get("TWILIO_TOKEN");
const phone = config.get("TWILIO_NUMBER");
const client = new twilio(accountSid, authToken);

async function sendSms(smsData) {
  try {
    await client.messages.create({
      body: smsData.body,
      to: smsData.to,
      from: phone,
    });
    console.log("sms sent");
  } catch (error) {
    console.log(error);
  }
}

export default sendSms;
