import pool from "../config/db.js"

export const addTweetLike=async(req,res)=>{
    const{refId,type}=req.body
    const{id:userId}=req.user
    const conn=await pool.getConnection()
    try {
        await conn.beginTransaction()

        const[[result]]=await conn.query('call addLike(?,?,?)',[userId,refId,type])
        console.log(result)
        
   
        res.status(200).json({result })
        await conn.commit()
    } catch (error) {
        await conn.rollback()
        console.log(error)
    }
    finally{
        conn.release()
    }
}