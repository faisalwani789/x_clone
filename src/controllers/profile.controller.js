import pool from "../config/db.js"

export const getProfile = async (req, res) => {
    const conn = await pool.getConnection()
    const { id } = req.body
    try {
        //get user+posts
        await conn.beginTransaction()
        const [[profile]]=await conn.execute('call getProfile(?)',[id])
        res.status(200).json({ success: true, profile:profile[0]})

    } catch (error) {
        conn.rollback()
        res.status(500).json({ success: false, message: error.message })
    }
    finally {
     conn.release()
    }
}