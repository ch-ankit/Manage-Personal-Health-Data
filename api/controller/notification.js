exports.io = (io, name, doctorId) => {
    io.on('connection', (socket) => {
        console.log(`${name} shared their records to ${doctorId}`)
        socket.on('joinNotifications', (params, cb) => {
            console.log(params)
            socket.join(params.sender)
            cb()
        })

        socket.on('sendNotifications', (request) => {
            console.log(request)
            io.to(request.reciever).emit('recieveNotifications', request)
        })
    })
}