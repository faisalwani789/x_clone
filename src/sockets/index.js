
//io -> input output used to handle sockets
import registerNotificationHandler from "./notification.socket.js"



export const socketIndex=(io)=>{
    //when a connection is established , we will get a socket that is a_>client
    io.on('connection',(socket)=>{
        console.log(' a new user connected:'+socket.id)

        //register handlers ...
        registerNotificationHandler(io,socket)
        
    })
}