import bcrypt from 'bcrypt'
import pool from '../config/db.js';
import { uploadOnCloudinary } from '../utils/cloundinary.js';
import jwt from 'jsonwebtoken'
const generateAccessToken = function(userId,email,username,fullName){
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
const generateRefreshToken= function(userId){
    return jwt.sign(
        {
            id:userId,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const addUser = async (req, res) => {

    const { fullName, email, rawPassword,bio='' } = req.body
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

        if (!profileLocalPath) {
            throw new Error("profile  is required")
        }

        const profile = await uploadOnCloudinary(profileLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)

        if (!profile) {
            throw new Error(400, "profile  file is required")
        }



        await conn.execute('call add_User(?,?,?,?,?,?)', [email, password, profile.url, coverImage?.url || "", fullName,bio])

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

export const loginUser=async(req,res)=>{
    const{password,email}=req.body
    const conn= await pool.getConnection()
    try {
         if (!password && !email) {
            throw new Error(400, "password or email is required")
         }
        
        await conn.beginTransaction()

        // const [user]= await conn.query('select password,id,userName,fullName from user where email=?',[email])
        // return res.json(user)
        
        // return res.json(userPassword)
       
        const [[[{id,email:userEmail,username,fullName,password:userPassword}]]]=await conn.execute('call loginUser(?)',[email])
        console.log(id)
        if (!id) {
            // console.log(user)
            throw new Error('User not found');
        }
        // console.log('usr'+JSON.stringify(user[0]))
        const isMatch=await bcrypt.compare(password,userPassword)
        if(!isMatch)res.status(400).json({success:true,message:'invalid credentials'})

        const accessToken=generateAccessToken(id,userEmail,username,fullName)
        const refereshToken=generateRefreshToken(id)


        await conn.commit()
         res.status(200).json({ success: true, accessToken,refereshToken })
        
    } catch (error) {
       conn.rollback()
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
    finally {
         conn.release()
    }
}