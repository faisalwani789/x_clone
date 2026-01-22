import pool from "../config/db.js"
import buildCommentTree from "../utils/comment.js"
export const getTweetComments=async(req,res)=>{
    const{id}=req.query
    
    const conn=await pool.getConnection()
    try {
        await conn.beginTransaction()

        const[[result]]=await conn.query('call getTweetComments3(?)',[id])
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
    const{id:tweetId,commentId=null}=req.query
    const{comment}=req.body
    const{id}=req.user
    const conn=await pool.getConnection()
    try {
        await conn.beginTransaction()

        const[[result]]=await conn.query('call addComment(?,?,?,?)',[id,tweetId,comment,commentId])
        
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