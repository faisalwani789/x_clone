import express from 'express'
import { configDotenv } from 'dotenv'
import userRouter from './src/router/user.routes.js'
configDotenv()
const port=process.env.PORT
const app=express()
app.use(express.json())
app.use(express.static("public"))

app.use('/users',userRouter)

app.listen(port,()=>{
    console.log('listening to port'+port)
})
