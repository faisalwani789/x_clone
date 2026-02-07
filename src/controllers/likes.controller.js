import { timeStamp } from "console"
import pool from "../config/db.js"

export const addTweetLike=async(req,res)=>{
    const io=req.app.get('io')
    const{refId,type,userId:authorId}=req.body //author id is the ownwer of the tweet/post
    const{id:userId,userName}=req.user 
    console.log(req.user)
    const notification={
        //send this notifcation to the author of the post refId and type
        type:'like',
        message:`${userName} liked your post`,
        from :userId, //logged in user
        timeStamp:new Date(),
        read:false
    }
    const conn=await pool.getConnection()
    try {
        await conn.beginTransaction()
        // const[row]= await conn.execute('select * from user where ')
        const[[result]]=await conn.query('call addLike(?,?,?,?)',[userId,authorId,refId,type])
        // console.log(result)
        
        //send notification
        io.to(`user:${authorId}`).emit('notification',notification)

        
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