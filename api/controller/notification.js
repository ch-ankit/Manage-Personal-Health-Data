exports.io = (io) => {
    io.on('connection', (socket) => {
        console.log(socket)
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