import jwt from 'jsonwebtoken'
import pool from '../config/db.js'
export const authMiddleware = async (req, res, next) => {
  try {
    const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if (!token) return res.send('please login')
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = decoded
    // console.log(req.user)
    next()
  } catch (error) {
    res.status(500).send(error.message)
  }

}

export const isAdmin=async(req,res,next)=>{
  const conn=await pool.getConnection()
   const {id}=req.user
  try {
   
    const[[isAdmin]]=await pool.execute('select role from user where id=?',[id])
    if(isAdmin.role===1) return res.status(403).send('Access Denied')
    console.log(isAdmin)
    next()
  } catch (error) {
     res.status(500).send(error.message)
  }
}