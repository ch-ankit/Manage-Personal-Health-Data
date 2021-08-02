const socketIO = require('socket.io');
const app = require('./index.js');

PORT = process.env.PORT || 7000;

const server = app.listen(PORT, () => {
  console.log(`server started at localhost:${PORT}`);
});
const io = socketIO(server, {
  path: '/notification/',
  cors: {
    origin: 'http://localhost:3000'
  }
})
let socketUsers = []

const removeUsers = (socketId) => {
  socketUsers = socketUsers.filter(user => user.socketId !== socketId)
}
const addUsers = (userId, socketId) => {
  !socketUsers.some((user) => user.userId == userId) &&
    socketUsers.push({ userId, socketId })
}
io.on('connection', (socket) => {
  console.log('Connected to server')
  socket.on('addUser', userId => {
    console.log(userId)
    addUsers(userId, socket.id)
    io.emit('getUsers', socketUsers)
  })
  //send and get notification
  socket.on('disconnect', () => {
    console.log('A user disconnected')
    removeUsers(socket.id)
    io.emit('getUsers', socketUsers)
  })
})
app.set('socketServer', io)