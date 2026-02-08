
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
    const { tweetId, type = null, commentId = null, comment ,userId:authorId} = req.body
    const { id:userId ,userName} = req.user
    const io=req.app.get('io')
    // console.log(tweetId, type)
    const conn = await pool.getConnection()
    try {
        await conn.beginTransaction()
        const [postType] = await conn.query('select * from master_tweettypes where id=?', [type])
        const message = `${userName} replied to  your ${postType[0].name}`

        const [[result]] = await conn.query('call addComment(?,?,?,?,?,?,?)', [userId,userName, authorId,tweetId, type, comment, commentId])
        const noticationId= result[0].notificationId
        console.log(noticationId)
        const room = `user:${authorId}`
        const socketsInTheRoom = await io.in(room).fetchSockets()
        if (socketsInTheRoom.length > 0) {
            // const notication = {
            //     message: message,
            //     type: 'comment',
            //     from: userId, //logged in user
            //     to:authorId,
            //     timeStamp: new Date()

            // }
            console.log('notification send')
            //user is online send notication
            //send notification
            const [[notication]]=await conn.query('call getCommentNotificationById(?)',[noticationId])
            console.log(notication)
            io.to(`user:${authorId}`).emit('notification', notication)
        }

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