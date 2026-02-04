import nodemailer, { createTransport, } from "nodemailer"
import dotenv, { configDotenv } from "dotenv"
import emailTemplate from "../utils/email.template.js"
// dotenv.config({ path: "../../.env" })
configDotenv('../../.env')
console.log(process.env.X_MAIL)
const transporter = nodemailer.createTransport({
  service: "gmail",
  //   port: 587,
  //   secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.X_MAIL,
    pass: process.env.X_PASS,
  },
});

export const generateOtp = function () {

  let digits = "01234567890"
  let otp = ''
  let otpLength = digits.length
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * otpLength)]
  }
  return otp
}


export const SendMailToClient = async (to,subject,otp,title,message,validTime) => {
  // Send an email using async/await
  const send = async () => {

    const info = await transporter.sendMail({
      from:`X_clone <${process.env.X_MAIL}>` ,
      to: to,
      subject: subject,
      // text: otp, // Plain-text version of the message
      html: emailTemplate(otp,title,message,validTime,2026,'X'), // HTML version of the message
    });

    console.log("Message sent:", info.messageId);
  }

  try {
    send()
    return true
  } catch (error) {
    console.log(error.message)
    return false
  }

}

