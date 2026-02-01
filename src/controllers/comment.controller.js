
import pool from "../config/db.js"
import buildCommentTree from "../utils/comment.js"
export const getTweetComments = async (req, res) => {
    let { id, type, page, limit, sortBy='recent' } = req.query
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const offset = (page - 1) * 10
    console.log(offset)
    const conn = await pool.getConnection()
    try {
       

        const [[result]] = await conn.query('call getCommentsV2(?,?,?,?,?)', [id, type,limit,offset,sortBy])
        console.log(result)
        const comments = buildCommentTree(result)
        // res.status(200).json({result })
        res.status(200).json({ comments })
  
    } catch (error) {
      
        console.log(error)
         res.status(500).json({message:error.message })
    }
    finally {
        conn.release()
    }
}
export const addTweetComments = async (req, res) => {
    const { tweetId, type = null, commentId = null, comment } = req.body
    const { id } = req.user
    console.log(tweetId, type)
    const conn = await pool.getConnection()
    try {
        await conn.beginTransaction()

        const [[result]] = await conn.query('call addComment(?,?,?,?,?)', [id, tweetId, type, comment, commentId])

        res.status(200).json({ result })
        // res.status(200).json({resu })
        await conn.commit()
    } catch (error) {
        await conn.rollback()
        console.log(error)
    }
    finally {
        conn.release()
    }
}