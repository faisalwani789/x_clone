import bcrypt from 'bcrypt'
import pool from '../config/db.js';
import { uploadOnCloudinary } from '../utils/cloundinary.js';
import jwt from 'jsonwebtoken'
import { generateOtp } from '../services/sendMail.js';
import { SendMailToClient } from '../services/sendMail.js';
import { defaultProfileImage } from '../constants/db.default.js';
import { otpMessage, otpTitle, otpSubject, forgetPasswordMessage, forgetPasswordSubject, forgetPasswordTitle } from '../constants/email.constants.js';
import { generateResetToken, hashToken } from '../utils/generateToken.js';
const generateAccessToken = function (userId) {
    return jwt.sign(
        {
            id: userId
            // email: email,
            // username: username,
            // fullName: fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
const generateRefreshToken = function (userId) {
    return jwt.sign(
        {
            id: userId,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const sendOtp = async (req, res) => {
    const { email } = req.body
    console.log(email)
    if (!email) throw new Error('please enter email address')
    const otp = generateOtp()
    const conn = await pool.getConnection()
    try {
        const isSuccess = await SendMailToClient(email, otpSubject, otp, otpTitle, otpMessage, 5)
        if (!isSuccess) {
            throw new Error('something went wrong')
        }
        const hashedOtp = await bcrypt.hash(otp, 10)
        // const [response]=await conn.execute('insert into userotps (email,otp)values (?,?)',[email,hashedOtp])
        const [[response]] = await conn.execute('call addOtp(?,?)', [email, hashedOtp])
        res.status(201).json({ success: true, response })
    } catch (error) {

        res.status(500).json({ success: false, message: error.message })
    }
    finally {
        conn.release()
    }
}

export const verifyEmail = async (req, res) => {

    const { email, otp } = req.body
    if (!email && otp) throw new Error('please enter email and otp')
    const conn = await pool.getConnection()
    try {


        await conn.execute('call getOtp(?,@otp)', [email])
        const [[row]] = await conn.query(
            'SELECT @otp AS hashedOtp'
        );
        const isMatch = await bcrypt.compare(otp, row.hashedOtp)
        if (!isMatch) throw new Error('please enter a valid otp')
        const [result] = await conn.execute('update userotps set isUsed=? where email=?', [1, email])
        // const[result]= await conn.execute('call updateOtpRecord(?,?)'[email,otp])
        res.status(200).json({ success: true, message: 'otp verified successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    } finally {
        conn.release()
    }
}

export const addUser = async (req, res) => {
    // const {id}=req.user || null
    const { fullName, email, rawPassword, bio = '' } = req.body
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

        await conn.commit()
        res.status(201).json({ success: true, message: 'user added successfully' })

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
        if (!password && !email) {
            throw new Error(400, "password or email is required")
        }

        // const [user]= await conn.query('select password,id,userName,fullName from user where email=?',[email])
        // return res.json(user)

        // return res.json(userPassword)

        const [[[{ id, email: userEmail, username, fullName, password: userPassword }]]] = await conn.execute('call loginUser(?)', [email])
        console.log(id)
        if (!id) {
            // console.log(user)
            throw new Error('User not found');
        }
        // console.log('usr'+JSON.stringify(user[0]))
        const isMatch = await bcrypt.compare(password, userPassword)
        if (!isMatch) return res.status(400).json({ success: true, message: 'invalid credentials' })

        const accessToken = generateAccessToken(id)
        const refreshToken = generateRefreshToken(id)

        await conn.execute('insert into refresh_tokens (token,userId,isUsed,expiresAt) values (?,?,?,now()+interval ? day)',[refreshToken,id,false,15])
        res.cookie("accessToken", accessToken, options)
        res.cookie("refreshToken", refreshToken, options)

        res.status(200).json({ success: true, accessToken, refreshToken })

    } catch (error) {
        conn.rollback()
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
    finally {
        conn.release()
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

        const { newPassword, token } = req.body
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

export const refreshToken=async(req,res)=>{
    const options = {
        httpOnly: true,
        secure: false
    }
    const conn=await pool.getConnection()
    try {
        const token=req.cookies.refreshToken
        if(! token) throw new Error ('please login again')
        await conn.beginTransaction()
        const[rows]=await conn.execute('select * from refresh_tokens where token=?',[token])
        if(rows.length===0){
            throw new Error('invalid token')
        }
         const userId=rows[0].userId
        const expiresAt=rows[0].expiresAt
        const isUsed=rows[0].isUsed
       
        if(isUsed ){
            //token reuse
            //delete the tokens 
            await conn.execute('delete from refresh_tokens where token=?',[token])
            res.clearCookie('refreshToken')
            throw new Error("token already used --- token reuse")
        }

         if(expiresAt < new Date()){
            await conn.execute('delete from refresh_tokens where token=?',[token])
            throw new Error ('token expired')
        }
        await conn.execute ('update refresh_tokens set isUsed=true where token=?',[token])
       
        const accessToken=generateAccessToken(userId)
        const refreshToken = generateRefreshToken(userId)

        // save new refresh token 
        await conn.execute('insert into refresh_tokens (token,userId,isUsed,expiresAt) values (?,?,?,now()+interval ? day)',[refreshToken,userId,false,15])
        res.cookie("accessToken", accessToken, options)
        res.cookie("refreshToken", refreshToken, options)

        await conn.commit()
        res.status(201).json({success:true,accessToken})

    } catch (error) {
        await conn.rollback()
        res.status(500).json({success:false,message:error.message})
    }
    finally{
        conn.release()
    }
}