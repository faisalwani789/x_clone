import pool from "../config/db.js"
import { uploadOnCloudinary } from "../utils/cloundinary.js"

export const getProfile = async (req, res) => {
    const conn = await pool.getConnection()
    const { id } = req.params
    try {
        //get user

        const [[profile]] = await conn.execute('call getProfile(?)', [id])

        res.status(200).json({ success: true, profile: profile })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
    finally {
        conn.release()
    }
}
export const updateProfile = async (req, res) => {
    const conn = await pool.getConnection()
    const { id } = req.user
    const { fullName= null, bio=null } = req.body
    let coverImageLocalPath;
    let profileImageLocalPath;
    // if(fullName==bio==null ) 
    try {
      
        if(req.files && Array.isArray(req.files.profile) && req.files.profile.length>0){
            profileImageLocalPath=req.files.profile[0].path
        }
        if (req.files && Array.isArray(req.files.cover) && req.files.cover.length > 0) {
            coverImageLocalPath = req.files.cover[0].path
        }

        const profile = await uploadOnCloudinary(profileImageLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)

        // console.log(profile)
        // console.log(coverImage)
        const [[result]] = await conn.execute('call updateProfile(?,?,?,?,?)', [id, fullName, profile?.url ??null, coverImage?.url ?? null, bio])

        res.status(200).json({ success: true, result })

    } catch (error) {

        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
    finally {
        conn.release()
    }
}
export const getProfilePosts = async (req, res) => {
    const conn = await pool.getConnection()
    const { id } = req.body
    const { id: viewerId } = req.user
    let access
    if (req.body.id)
        try {
            //get user+posts
            await conn.beginTransaction()
            const [[profile]] = await conn.execute('call getProfilePosts(?,?)', [id, viewerId])
            await conn.commit()
            res.status(200).json({ success: true, profile: profile })

        } catch (error) {
            conn.rollback()
            res.status(500).json({ success: false, message: error.message })
        }
        finally {
            conn.release()
        }
}
export const setPrivateProfile = async (req, res) => {
    const { id } = req.user || req.body

    const conn = await pool.getConnection()
    try {
        await conn.beginTransaction()
        const [[result]] = await conn.execute('call setPrivateProfile(?)', [id])

        await conn.commit()
        res.status(200).json({ success: true, result: result[0].result })
    } catch (error) {
        conn.rollback()
        res.status(500).json({ success: false, message: error.message })
    }
    finally {
        conn.release()
    }
}