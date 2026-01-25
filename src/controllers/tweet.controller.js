import pool from "../config/db.js"
import buildCommentTree from "../utils/comment.js"
import { uploadOnCloudinary } from "../utils/cloundinary.js"
export const addTweet=async(req,res)=>{
    const{content=null,tweetId=null,type}=req.body
    
    console.log(type)
    // console.log(content)
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
        const [message]=await conn.execute('call addTweet(?,?,?,?,?)',[content,userId,JSON.stringify(cloudinaryLinks),type,tweetId]) // add tweet 
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

export const getTweets=async(req,res)=>{
     const conn=await pool.getConnection()
    try {
        await conn.beginTransaction()
        const[[result]]=await conn.query('call getTweets(?,?)',[10,0])
        await conn.commit()
          res.status(200).json({result:result[0]})
    } catch (error) {
        console.log(error)
        await conn.rollback()
    }
    finally{
        await conn.release()
    }
}
export const getFollowingTweets=async(req,res)=>{
    const{id}=req.user
     const conn=await pool.getConnection()
    try {
        await conn.beginTransaction()
        const[[result]]=await conn.execute('call getFollowingTweets(?,?,?)',[id,10,0])
        
        await conn.commit()
          res.status(200).json({result:result[0]})
    } catch (error) {
        console.log(error)
        await conn.rollback()
    }
    finally{
        await conn.release()
    }
}
