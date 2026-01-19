import pool from "../config/db.js"
export const handleRequest = async(req,res) => {
    const{toUserId}=req.body
    const{id:fromUserId}=req.user
    const conn= await pool.getConnection()
    try {
        await conn.beginTransaction()
        const [[result]]=await conn.execute('call sendRequest(?,?)',[toUserId,fromUserId])    
        console.log(result)
        await conn.commit()
        res.status(201).json({msg:result[0].result})
    } catch (error) {
        await conn.rollback()
          res.status(500).json({ success: false, message: error.message })
    }
    finally{
        await conn.release()
    }
}
export const getFollowers=async(req,res)=>{
    const conn= await pool.getConnection()
    try {
        
    } catch (error) {
        
    }
    finally{

    }
}
