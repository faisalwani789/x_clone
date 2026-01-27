import pool from "../config/db.js"

export const getProfile = async (req, res) => {
    const conn = await pool.getConnection()
    const { id } = req.body
    const {id:viewerId}=req.user
    let access
    if (req.body.id)
    try {
        //get user+posts
        await conn.beginTransaction()
        const [[profile]]=await conn.execute('call getProfile(?,?)',[id,viewerId])
        await conn.commit()
        res.status(200).json({ success: true, profile:profile})

    } catch (error) {
        conn.rollback()
        res.status(500).json({ success: false, message: error.message })
    }
    finally {
     conn.release()
    }
}
export const setPrivateProfile =async(req,res)=>{
    const{id}=req.user|| req.body
 
    const conn = await pool.getConnection()
    try {
        await conn.beginTransaction()
        const [[result]]=await conn.execute('call setPrivateProfile(?)',[id])
      
        await conn.commit()
         res.status(200).json({ success: true, result:result[0].result})
    } catch (error) {
        conn.rollback()
        res.status(500).json({ success: false, message: error.message })
    }
    finally{
        conn.release()
    }
}