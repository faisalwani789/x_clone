import pool from "../config/db.js"
import buildCommentTree from "../utils/comment.js"
export const getTweetComments=async(req,res)=>{
    const{id,type}=req.query
    
    const conn=await pool.getConnection()
    try {
        await conn.beginTransaction()

        const[[result]]=await conn.query('call getTweetComments(?,?)',[id,type])
        console.log(result)
        const comments=buildCommentTree(result[0]?.json_data)
        // res.status(200).json({result })
        res.status(200).json({comments })
        await conn.commit()
    } catch (error) {
        await conn.rollback()
        console.log(error)
    }
    finally{
        conn.release()
    }
}
export const addTweetComments=async(req,res)=>{
    const{tweetId,type=null,commentId=null,comment}=req.body
    const{id}=req.user
    console.log(tweetId,type)
    const conn=await pool.getConnection()
    try {
        await conn.beginTransaction()

        const[[result]]=await conn.query('call addComment(?,?,?,?,?)',[id,tweetId,type,comment,commentId])
        
        res.status(200).json({result })
        // res.status(200).json({resu })
        await conn.commit()
    } catch (error) {
        await conn.rollback()
        console.log(error)
    }
    finally{
                conn.release()
    }
}