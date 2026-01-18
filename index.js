import express from 'express'
import { configDotenv } from 'dotenv'
import userRouter from './src/router/user.routes.js'
import tweetRouter from './src/router/tweet.routes.js'
import profileRouter from './src/router/profile.routes.js'
import friedRequestRouter from './src/router/friend.requrest.routes.js'
configDotenv()
const port=process.env.PORT
const app=express()
app.use(express.json())
app.use(express.static("public"))

app.use('/users',userRouter)
app.use('/tweets',tweetRouter)
app.use('/profile',profileRouter)
app.use('/followers',friedRequestRouter)

app.listen(port,()=>{
    console.log('listening to port'+port)
})
