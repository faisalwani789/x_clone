import pool from "../config/db.js"
import buildCommentTree from "../utils/comment.js"

import { uploadOnCloudinary } from "../utils/cloundinary.js"
import { sendNotification } from "../helpers/send.notification.js"
export const addTweet = async (req, res) => {
    const { content = null, tweetId = null, type, parentRef = null,targetUserId =null} = req.body
    const io=req.app.get('io')
    const { id: userId,userName } = req.user
    let mediaPathLocal;
    let cloudinaryLinks = [];
    const conn = await pool.getConnection()
    try {
       
        await conn.beginTransaction()
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            mediaPathLocal = req.files
            // return res.json(req.files)
            // console.log(req.files)

            //    mediaPath = req.files.media[0].path

        }
        if (mediaPathLocal && mediaPathLocal.length > 0) {
            for (const file of mediaPathLocal) {
                const response = await uploadOnCloudinary(file.path)
                cloudinaryLinks.push(response.url)
            }
        }
        
        // console.log(cloudinaryLinks)
        const [[result]] = await conn.execute('call addTweet(?,?,?,?,?,?,?,?)',[content, userName,userId, JSON.stringify(cloudinaryLinks), type, tweetId, targetUserId,parentRef]) // add tweet 
        console.log(result)
        const notificationId=result[0]?.notificationId
        
        
        const room=`user:${targetUserId}`
        const socketsInTheRoom= await io.in(room).fetchSockets()
        if(socketsInTheRoom.length>0 && notificationId){
            //notificaion
            sendNotification(conn,notificationId,io,room)
        }
      
        await conn.commit()
        res.status(201).json({
            success:true,
             message:result[0].message
        })

    } catch (error) {

        // console.log(error)
        res.status(500).json({ success: false, message: error.message })
    } finally {
        conn.release()
    }
}

export const getTweets = async (req, res) => {
    const abortController=new AbortController()
    const {signal}= abortController
    let destroyed=false
    // req.signal=signal
    
    signal.addEventListener('abort',()=>{
        console.log('signal aborted')
    })

    const conn = await pool.getConnection()

         req.on('close',()=>{
        if(!res.writableEnded){
            // abC.abort(new Error('client disconnected'))
            console.log([req.method +" "+ req.url]+'client closed the connection')
        // abC.abort()
         destroyed=true
         conn.destroy()
        }
        else{
            console.log('response sent successfully...')
        }
        
    })
 
    try {
   
        // const [[result]] = await conn.execute('call getTweets(?,?)', [10, 0])
        // await conn.query('set session max_execution_time = 1 ')
        // await conn.query('select sleep(5)')
    
       const[rows]= await conn.query({sql:'select sleep(5)'})
    //    console.log(rows)
        res.status(200).json({ result: rows})
    } catch (error) {
        console.log(error)
        if(error.name==='AbortError'){
            console.log('query cancelled')
        }
        res.status(500).json({ success: false, message: error.message })
    }
    finally {
        if(!destroyed)conn.release()
        
    }
}
export const getTweetById = async (req, res) => {
    const { retweetId = null, retweetType = null } = req.query
    console.log(retweetId)
    const { id } = req.params
    const { id: userId } = req.user
    const conn = await pool.getConnection()
    try {

        const [[result]] = await conn.query('call getTweetById(?,?,?,?)', [id, retweetId, retweetType, userId])

        res.status(200).json({ result: result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
    finally {
        conn.release()
    }
}

export const getFollowingTweets = async (req, res) => {
    const { id } = req.user
    let { page, limit } = req.query
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const offset = (page - 1) * 10
    const conn = await pool.getConnection()
    try {
        const [[result]] = await conn.execute('call getFollowingTweetsV2(?,?,?)', [id, limit, offset])
        res.status(200).json(result)
    } catch (error) {
        console.log(error)

    }
    finally {
        conn.release()
    }
}

