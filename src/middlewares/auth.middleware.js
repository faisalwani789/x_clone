import jwt from 'jsonwebtoken'
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