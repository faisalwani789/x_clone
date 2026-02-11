import pool from "../config/db.js";

export const getNotifications=async(req,res)=>{
    const conn=await pool.getConnection()
    const{id}=req.user
    try {

        const[[notifcations]]=await conn.execute('call myNotifications(?)',[id])
        res.status(200).json({
            success:true,
            notifcations
        })
    } catch (error) {
        console.log(error)
    }
    finally{
        conn.release
    }
}
