import http from 'http'
import { Server } from 'socket.io'
import app from './index.js'
import { socketIndex } from './src/sockets/index.js'
const PORT=process.env.PORT || 5000
import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv'

configDotenv()
const server= http.createServer(app)

//initialize the socket io

const io= new Server(server,{
    cors:{
        origin:'*',
        methods:['GET','POST']
    }
})
//socket io middleware
io.use((socket,next)=>{
    console.log('new connection attempt from '+socket.handshake.query.token)
    const token=socket.handshake.auth.token || socket.handshake.query.token
    if(! token) return next(new Error('authentication token required'))
        try {
            const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
            socket.user=decoded //attaching user to socket
            socket.data.userId=decoded.id //using socket.data for custom fields
            next()
        } catch (error) {
            console.log(error)
            next(new Error('invalid token'))
            
        }
})

// we can chain middlewares here

//attach io to the app(useful in controllers)
app.set('io',io);

socketIndex(io)
server.listen(PORT,()=>{
    console.log('server running on port'+ PORT)
    console.log('socket io ready-> http://localhost:'+ PORT)
})