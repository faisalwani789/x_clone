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

export const readNotification=async(req,res)=>{
    const conn=await pool.getConnection()
    const{id}=req.user
    const{notificationId}=req.params
    const query=`update notifications set isRead = ? where id = ? and targetUserId = ?`
    try {
        await conn.beginTransaction()
        const[notifcation]=await conn.execute(query,[true,notificationId,id])
        await conn.commit()
        if (notifcation.affectedRows===0){
            return res.status(400).json({
            success:false,
            message:'notification not found'
        })
        }
        console.log(notifcation)
        res.status(200).json({
            success:true,
            message:'notification read successsfully'
        })
    } catch (error) {
        await conn.rollback()
        console.log(error)
    }
    finally{
        conn.release
    }
}
