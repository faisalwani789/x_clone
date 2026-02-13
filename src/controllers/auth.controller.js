import bcrypt from 'bcrypt'
import pool from '../config/db.js';
import { uploadOnCloudinary } from '../utils/cloundinary.js';
import jwt from 'jsonwebtoken'
import { sendOtpService } from '../services/send.otp.service.js';
import { generateOtp } from '../services/sendMail.js';
import { SendMailToClient } from '../services/sendMail.js';
import { defaultProfileImage } from '../constants/db.default.js';
import { otpMessage, otpTitle, otpSubject, forgetPasswordMessage, forgetPasswordSubject, forgetPasswordTitle } from '../constants/email.constants.js';
import { generateResetToken, hashToken } from '../utils/generateToken.js';
import { verifyUserService } from '../services/verify.user.service.js';
import { generateAccessToken, generateRefreshToken } from '../services/token.service.js';



export const sendOtp = async (req, res) => {
    //this send otp will be for those users who want to verify email who are already registerred in user table
    const { email } = req.body
    // console.log(email)
    const conn = await pool.getConnection()
    try {
        const[user]= await conn.execute('select id,email from user where email=? '[email])
        if(!user || user.length===0){
            return res.status(400).json({ success: false, message: 'invalid request' })

        }
        await sendOtpService(conn,email)
       
        res.status(201).json({ success: true, response })
    } catch (error) {

        res.status(500).json({ success: false, message: error.message })
    }
    finally {
        conn.release()
    }
}



export const verifyUser = async (req, res) => {

    const { email, otp } = req.body
    // console.log(email, otp)
    const conn = await pool.getConnection()
    try {

        await conn.beginTransaction()
        // await conn.execute('call getOtp(?,@otp)', [email])
        // const [[row]] = await conn.query(
        //     'SELECT @otp AS hashedOtp'
        // );
        await verifyUserService(conn, email, otp)
        const [verify] = await conn.execute('update user set isVerified=? where email=?', [1, email])
        if (verify.changedRows == 0) {
            // console.log(verify)
            return res.status(400).json({ success: false, message: 'make sure user is registered' })

        }

        await conn.commit()
        res.status(200).json({ success: true, message: 'otp verified successfully' })
    } catch (error) {
        await conn.rollback()
        // console.log(error)
        res.status(500).json({ success: false, message: error.message })
    } finally {
        conn.release()
    }
}

export const addUser = async (req, res) => {
    // const {id}=req.user || null
    const { fullName, email, password: rawPassword, bio = '' } = req.body
    console.log()
    const role = 1;
    let coverImageLocalPath;
    let profileLocalPath;
    const conn = await pool.getConnection()
    try {
        await conn.beginTransaction()
        const password = await bcrypt.hash(rawPassword, 10)

        // const file1=req.files['profile']
        // const file2=req.files['cover']

        // const profileLocalPath = req.files?.profile[0]?.path;
        //const coverImageLocalPath = req.files?.coverImage[0]?.path;

        if (req.files && Array.isArray(req.files.profile) && req.files.profile.length > 0) {
            profileLocalPath = req.files.profile[0].path
        }

        if (req.files && Array.isArray(req.files.cover) && req.files.cover.length > 0) {
            coverImageLocalPath = req.files.cover[0].path
        }

        // if (!profileLocalPath) {
        //     throw new Error("profile  is required")
        // }

        const profile = await uploadOnCloudinary(profileLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)

        // if (!profile) {
        //     throw new Error(400, "profile  file is required")
        // }



        await conn.execute('call addUser(?,?,?,?,?,?,?)', [email, password, profile?.url || defaultProfileImage, coverImage?.url ?? null, fullName, bio, role])

        const otp = await sendOtpService(conn,email)
        
        await conn.commit()
        res.status(201).json({ success: true, message: 'user added temporarily , otp send verify' })

    } catch (error) {
        conn.rollback()
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
    finally {
        conn.release()
    }
}

export const loginUser = async (req, res) => {

    const { password, email } = req.body
    const options = {
        httpOnly: true,
        secure: true
    }
    const conn = await pool.getConnection()
    try {
        const [User] = await conn.query('select id,fullName,password,isVerified , isTwoFactorAuthentication from user where email=?', [email])
        if (!User || User.length === 0) {
            return res.status(400).json({ success: false, message: 'invalid credentials' })
        }
        const id = User[0].id
        const fullName = User[0].fullName
        const userPassword = User[0].password
        const isVerified = User[0].isVerified
        const is2fa = User[0].isTwoFactorAuthentication
        if (!isVerified) {
            return res.status(400).json({ success: false, message: 'please verify your email' })
        }
        // const [[[{ id, email: userEmail,  fullName, password: userPassword }]]] = await conn.execute('call loginUser(?)', [email])
        // console.log(id)
        // if (!id) {
        //     // console.log(user)
        //     throw new Error('User not found');
        // }
        // console.log('usr'+JSON.stringify(user[0]))
        const isMatch = await bcrypt.compare(password, userPassword)
        if (!isMatch) return res.status(400).json({ success: true, message: 'invalid credentials' })

        //2fa
        if (!is2fa) {
            const accessToken = generateAccessToken(id, fullName)
            const refreshToken = generateRefreshToken(id)

            await conn.execute('insert into refresh_tokens (token,userId,isUsed,expiresAt) values (?,?,?,now()+interval ? day)', [refreshToken, id, false, 15])
            res.cookie("accessToken", accessToken, options)
            res.cookie("refreshToken", refreshToken, options)

            return res.status(200).json({ success: true, accessToken,refreshToken, message: ' user logged In' })
        }
        await sendOtpService(conn,email)


        res.status(200).json({ success: true, message: 'otp sent to your email please verify' })

    } catch (error) {
        conn.rollback()
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
    finally {
        conn.release()
    }
}
export const loginUser2Fa = async (req, res) => {
    const { email, otp } = req.body
    const options = {
        httpOnly: true,
        secure: true
    }
    const conn = await pool.getConnection()
    try {
        const [rows] = await conn.execute('select id, fullName ,email  from user where email = ?', [email])
        await verifyUserService(conn, email, otp)
        const id = rows[0].id
        const fullName = rows[0].fullName
        const accessToken = generateAccessToken(id, fullName)
        const refreshToken = generateRefreshToken(id)

        await conn.execute('insert into refresh_tokens (token,userId,isUsed,expiresAt) values (?,?,?,now()+interval ? day)', [refreshToken, id, false, 15])
        res.cookie("accessToken", accessToken, options)
        res.cookie("refreshToken", refreshToken, options)

        res.status(200).json({ success: true,accessToken,refreshToken, message: 'otp verified successfully user logged In' })
    } catch (error) {
        console.log(error)
        
        res.status(500).json({ success: false, message: error.message })
    }
}

export const forgetPassword = async (req, res) => {
    const conn = await pool.getConnection()
    const expiresAt = 'current_timestamp + interval  15 minutes'
    let resetLink = 'http://localhost:5000/users/reset-password?token=' //frontend page 
    try {
        const { email } = req.body

        // check if user exists-> if exists ->generate hash token with its id ->make a link with token+email-> send
        const [user] = await conn.execute('select id,email from user where email=?', [email])

        if (!user.length) {
            throw new Error('if  the email exist a link has been send')
        }
        const userId = user[0].id
        console.log(userId)

        await conn.query('update passwordresets set isUsed=true where id=?', [user[0].id])
        const token = generateResetToken()
        console.log(token)
        const hashedToken = hashToken(token)
        console.log(hashedToken)
        resetLink = resetLink + token
        await conn.query('insert into passwordresets (userId , token , expiresAt , isUsed) values(?,?,current_timestamp + interval  15 minute,?)', [userId, hashedToken, false])
        const isSuccess = await SendMailToClient(email, forgetPasswordSubject, resetLink, forgetPasswordTitle, forgetPasswordMessage, 15)
        if (!isSuccess) {
            throw new Error('something went wrong')
        }
        res.status(201).json({ success: true, message: 'password reset link has been sent to your email' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
    finally {
        conn.release()

    }
}

export const resetPassword = async (req, res) => {
    const conn = await pool.getConnection()
    try {

        const { password: newPassword, token } = req.body
        if (!token) throw new Error('token is required')
        const hashedToken = hashToken(token)

        await conn.beginTransaction()
        // find user with token in db, then check expiry time , and match token if success update password
        const [rows] = await conn.execute('select * from passwordresets where token=? and isUsed= false and expiresAt > current_timestamp', [hashedToken])
        if (!rows.length) throw new Error('invalid or expired token')
        console.log(rows)
        const userId = rows[0].userId
        const id = rows[0].id
        console.log(id + 'id')
        const hashedPassword = await bcrypt.hash(newPassword, 10)


        await conn.execute('update user set password=? where id=?', [hashedPassword, userId])
        await conn.execute('update passwordresets set isUsed = true where id=?', [id])
        await conn.commit()
        res.status(200).json({ success: true, message: 'password reset successfull' })

    } catch (error) {
        await conn.rollback()
        console.log(error)
        res.status(200).json({ success: false, message: error.message })
    }
    finally {
        conn.release()

    }
}

export const refreshToken = async (req, res) => {
    const options = {
        httpOnly: true,
        secure: false
    }
    const conn = await pool.getConnection()
    try {
        const token = req.cookies.refreshToken
        if (!token) throw new Error('please login again')
        await conn.beginTransaction()
        const [rows] = await conn.execute('select * from refresh_tokens where token=?', [token])
        if (rows.length === 0) {
            throw new Error('invalid token')
        }
        const userId = rows[0].userId
        const expiresAt = rows[0].expiresAt
        const isUsed = rows[0].isUsed

        //taking fullname for storing in jwt 
        const [user] = await conn.query('select fullName from user where id=?', [userId])
        const fullName = user[0].fullName

        if (isUsed) {
            //token reuse
            //delete the tokens 
            await conn.execute('delete from refresh_tokens where token=?', [token])
            res.clearCookie('refreshToken')
            throw new Error("token already used --- token reuse")
        }

        if (expiresAt < new Date()) {
            await conn.execute('delete from refresh_tokens where token=?', [token])
            throw new Error('token expired')
        }
        await conn.execute('update refresh_tokens set isUsed=true where token=?', [token])

        const accessToken = generateAccessToken(userId)
        const refreshToken = generateRefreshToken(userId, fullName)

        // save new refresh token 
        await conn.execute('insert into refresh_tokens (token,userId,isUsed,expiresAt) values (?,?,?,now()+interval ? day)', [refreshToken, userId, false, 15])
        res.cookie("accessToken", accessToken, options)
        res.cookie("refreshToken", refreshToken, options)

        await conn.commit()
        res.status(201).json({ success: true, accessToken })

    } catch (error) {
        await conn.rollback()
        res.status(500).json({ success: false, message: error.message })
    }
    finally {
        conn.release()
    }
}

export const request2Fa = async (req, res) => {
    const conn = await pool.getConnection()
    const { id } = req.user

    try {
        await conn.beginTransaction()
        const [user] = await conn.execute('select email,id ,isVerified,isActive from user where id=? and isVerified = 1 and isActive = 1', [id])
        if (!user || user.length === 0) {

        }
        const email = user[0].email
        //verify by otp
        const otp = await sendOtpService(conn,email)
        await conn.commit()
        res.status(201).json({ success: true, message: 'otp sent to email' })

    } catch (error) {
        console.log(error)
        await conn.rollback()
        res.status(500).json({ success: false, message: error.message })

    } finally {
        conn.release()
    }
}

export const activate2Fa = async (req, res) => {
    const conn = await pool.getConnection()
    const { id } = req.user
    const { otp } = req.body
    let userEmail;
    try {
        await conn.beginTransaction()
        const [rows] = await conn.execute('select email , isTwoFactorAuthentication from user where id = ?', [id])
        console.log(rows[0])
        if (rows[0].isTwoFactorAuthentication === 1) {
            return res.status(201).json({ success: true, message: 'already enabled' })
        }
        userEmail = rows[0].email
        const { isSuccess } = await verifyUserService(conn, userEmail, otp)
        // if (isSuccess){
        //enable 2fa
        const [result] = await conn.execute('update user set isTwoFactorAuthentication =? where email=?', [1, userEmail])
        if (result.affectedRows = 0) {
            return res.status(400).json({ success: false, message: 'something went wrong' })

        }
        await conn.commit()
        res.status(201).json({ success: true, message: '2fa is enabled' })

        // }

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
    finally {
        conn.release()
    }
}