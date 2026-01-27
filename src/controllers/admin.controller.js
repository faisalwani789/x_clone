import pool from "../config/db.js"

export const getDashboard=async(req,res)=>{
     const conn=await pool.getConnection()
    try {
        const[[data]]= await conn.execute('call getDashboard()')
         res.status(200).json({ success: true, data })
    } catch (error) {
         res.status(500).json({ success: false, message: error.message })
    }
}
export const getUsers=async(req,res)=>{
    let{order,sort,page,limit,isActive=1}=req.query
     page=Number(page)|| 1;
     limit=Number(limit)|| 10
     const offset=(page-1)*limit //0*limit
    const conn=await pool.getConnection()
    try {
        const[[users]]= await conn.execute('call getUsers(?,?,?,?,?)',[isActive,sort,order,limit,offset])
         res.status(200).json({ success: true, users })
    } catch (error) {
         res.status(500).json({ success: false, message: error.message })
    }
}

export const blockUser=async()=>{
    const{id}=req.body
     const conn=await pool.getConnection()
    try {
        const[[users]]= await conn.execute('call blockUser(id)')
         res.status(200).json({ success: true, users })
    } catch (error) {
         res.status(500).json({ success: false, message: error.message })
    }
}
