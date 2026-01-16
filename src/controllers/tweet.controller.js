import pool from "../config/db.js"
const body={
    'content':'hello',
    "media":['dd','dd'],
    "type":1,
    "parentId":null,
    "conversationId":null,
    "replyToId":null,
    "userId":1
}
import { uploadOnCloudinary } from "../utils/cloundinary.js"
export const addTweet=async(req,res)=>{
    const{content=null,conversationId=null,replyToId=null,tweetType=null,parentId=null}=req.body
    console.log(content)
    const {id:userId}=req.user
    // const {retweet=null }=req.params
    let mediaPathLocal;
    let cloudinaryLinks=[];
    const conn=await pool.getConnection()
    try {
        //user logged in 
        //take cotent from body stored in tweet model
        //take image link and store in media Images with id of tweet
        //
        
        await conn.beginTransaction()
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            mediaPathLocal=req.files
            // return res.json(req.files)
            // console.log(req.files)
            
        //    mediaPath = req.files.media[0].path

        }
        if(mediaPathLocal && mediaPathLocal.length >0){
            for(const file of mediaPathLocal){
            const response= await uploadOnCloudinary(file.path)
            cloudinaryLinks.push(response.url)
        }
        }
        
        console.log(cloudinaryLinks)
        const [[message]]=await conn.execute('call addTweet(?,?,?,?,?,?,?)',[content,userId,parentId,conversationId,replyToId,tweetType,JSON.stringify(cloudinaryLinks)]) // add tweet 
        console.log(message)
        // return res.json(cloudinaryLinks)
        // await conn.execute('call addMedia(?,?)',[cloudinaryLinks,tweet[0].id]) //attaching media
        await conn.commit()
        res.send(
         'posted successfully'
        )

    } catch (error) {
        console.log(error)
    }finally{
         conn.release()
    }
}