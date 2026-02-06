const registerNotificationHandler=(io,socket)=>{
    //when a user connects->join their personal rooom
    //assume client sends userIdn on connect after auth
    socket.on('register',({userId})=>{
        console.log(userId+'user')
        if(!userId) return

        socket.join('user:'+userId)
        console.log(userId)
        console.log(`user ${userId} registered and joined room with ${userId}`)

        socket.emit('registered',{userId,message:'your are now receiving notifications'})

        
    })
}

export default registerNotificationHandler