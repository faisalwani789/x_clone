import bcrypt from 'bcrypt'
import pool from '../config/db.js';
import { uploadOnCloudinary } from '../utils/cloundinary.js';
import jwt from 'jsonwebtoken'
import { generateOtp } from '../services/sendOtp.js';
import { SendOtpToClient } from '../services/sendOtp.js';
import { response } from 'express';
const generateAccessToken = function (userId, email, username, fullName) {
    return jwt.sign(
        {
            id: userId,
            email: email,
            username: username,
            fullName: fullName
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
        const isSuccess = await SendOtpToClient(email, otp)
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
        res.status(500).json({ success: true, message: 'otp verified successfully' })
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

    const conn = await pool.getConnection()
    try {
        await conn.beginTransaction()
        const password = await bcrypt.hash(rawPassword, 10)

        // const file1=req.files['profile']
        // const file2=req.files['cover']

        const profileLocalPath = req.files?.profile[0]?.path;
        //const coverImageLocalPath = req.files?.coverImage[0]?.path;


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



        await conn.execute('call addUser(?,?,?,?,?,?,?)', [email, password, profile.url, coverImage?.url || "", fullName, bio, role])

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
        secure: false
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
        if (!isMatch) res.status(400).json({ success: true, message: 'invalid credentials' })

        const accessToken = generateAccessToken(id, userEmail, username, fullName)
        const refreshToken = generateRefreshToken(id)

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