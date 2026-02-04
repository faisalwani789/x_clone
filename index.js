import express from 'express'
import cookieParser from 'cookie-parser'
import { configDotenv } from 'dotenv'
import authRouter from './src/router/auth.routes.js'
import tweetRouter from './src/router/tweet.routes.js'
import profileRouter from './src/router/profile.routes.js'
import friedRequestRouter from './src/router/friend.requrest.routes.js'
import commentRouter from './src/router/comment.routes.js'
import likeRouter from './src/router/like.routes.js'
import adminRouter from './src/router/admin.routes.js'
import searchRouter from './src/router/search.routes.js'
configDotenv()
const port=process.env.PORT
const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(express.static("public"))

app.use('/auth',authRouter)
app.use('/tweets',tweetRouter)
app.use('/profile',profileRouter)
app.use('/followers',friedRequestRouter)
app.use('/comments',commentRouter)
app.use('/likes',likeRouter)
app.use('/admin',adminRouter)
app.use('/search',searchRouter)


app.listen(port,()=>{
    console.log('listening to port'+port)
})
