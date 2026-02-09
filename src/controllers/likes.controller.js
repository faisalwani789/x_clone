import { timeStamp } from "console"
import pool from "../config/db.js"

export const addTweetLike = async (req, res) => {
    const io = req.app.get('io')
    const { refId, type, userId: authorId } = req.body //author id is the ownwer of the tweet/post
    const { id: userId, userName } = req.user
    // console.log(req.user)
    // const notification = {
    //     //send this notifcation to the author of the post refId and type
    //     type: 'like',
    //     message: `${userName} liked your post`,
    //     from: userId, //logged in user
    //     timeStamp: new Date(),
    //     isRead: false
    // }

    const conn = await pool.getConnection()
    try {
        await conn.beginTransaction()
        // const[row]= await conn.execute('select * from user where ')
        const [postType] = await conn.query('select * from master_tweettypes where id=?', [type])
        const message = `${userName} liked your ${postType[0].name}`
        console.log(message)
        const [[result]] = await conn.query('call addLike(?,?,?,?,?)', [userId,userName, authorId, refId, type])
        const noticationId= result[0].notificationId
        // const[result2]=await conn.query ('select @refId as likeId')
        // const likeId=result2[0].likeId
        // res.json(likeId)
        // console.log(result2)

        //saving notification
        // const [rows] = await conn.execute('call saveNotification(?,?,?)', [likeId, 1,message])
        // const [rows]= await conn.query('insert into notifications (refId,message,type) values(?,?,?)',[id,message,1])

        //first we have to check whether the user is online or not
        console.log(result)
        const room = `user:${authorId}`
        const socketsInTheRoom = await io.in(room).fetchSockets()

        if (socketsInTheRoom.length > 0 && noticationId) {
            //option1:constructing a message here and then sending
            //option2: querying directly from db notifications by Id
            // const notication = {
            //     message: message,
            //     type: 'like',
            //     from: userId, //logged in user
            //     to:authorId,
            //     timeStamp: new Date()

            // }
            console.log('notification send')
            //user is online send notication
            //send notification
            //get notification byId
            const [[notifcation]]=await conn.query('call getNotificationByIdV2(?)',[noticationId])
            io.to(`user:${authorId}`).emit('notification', notifcation)
        }



        res.status(200).json({success:true,message:'like added successfully'})
        await conn.commit()
    } catch (error) {
        await conn.rollback()
        console.log(error)
    }
    finally {
        conn.release()
    }
}

// export const getLiks