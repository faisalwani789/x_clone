import { generateOtp } from "./sendMail.js"
import { SendMailToClient } from "./sendMail.js"
import { otpMessage, otpTitle, otpSubject  } from "../constants/email.constants.js"
import bcrypt from 'bcrypt'

export const sendOtpService = async (conn,email) => {

    console.log(email)
    if (!email) throw new Error('please enter email address')
    const otp = generateOtp()

    try {
        const isSuccess = await SendMailToClient(email, otpSubject, otp, otpTitle, otpMessage, 5)
        if (!isSuccess) {
            throw new Error('something went wrong')
        }
        // return otp
        const hashedOtp = await bcrypt.hash(otp, 10)
        // // const [response]=await conn.execute('insert into userotps (email,otp)values (?,?)',[email,hashedOtp])
        const [[response]] = await conn.execute('call addOtp(?,?)', [email, hashedOtp]) //save
        return true
    } catch (error) {
        console.log(error)
    }
   
}

 // const isSuccess = await SendMailToClient(email, otpSubject, otp, otpTitle, otpMessage, 5)
        // if (!isSuccess) {
        //     throw new Error('something went wrong')
        // }
        // const [user] = await conn.execute('select email,isVerified from user where email=?', [email])
        // if (!user || user.length == 0) {
        //     return res.status(400).json({ success: false, message: 'please register first' })
        // }
        // if (user[0].isVerified) {
        //     return res.status(200).json({ success: true, message: 'already verified' })
        // }
        // const otp = await sendOtpService(email)
        // if (!otp) throw new Error('cant send otp')
        // const hashedOtp = await bcrypt.hash(otp, 10)
        // // const [response]=await conn.execute('insert into userotps (email,otp)values (?,?)',[email,hashedOtp])
        // const [[response]] = await conn.execute('call addOtp(?,?)', [email, hashedOtp])