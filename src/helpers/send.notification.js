export const sendNotification = async (conn,notifcationId, io, room) => {
    // console.log('notification')
    const [[notifcation]] = await conn.execute('call getNotificationByIdV2(?)', [notifcationId])
    console.log(notifcation)
    io.to(room).emit('notification', notifcation)
}