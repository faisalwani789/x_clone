import pool from "../config/db.js"
export const sendRequest = async(req,res) => {
    const{fromUserId ,toUserId}=req.body
    const conn= await pool.getConnection()
    try {
        await conn.beginTransaction()
        const [[result]]=await conn.execute('sendRequest(?,?)',[fromUserId,toUserId])    
        console.log(result)
        await conn.commit()
        res.status(201).json({msg:result[0].result})
    } catch (error) {
        await conn.rollback()
    }
    finally{
        await conn.release()
    }
}

