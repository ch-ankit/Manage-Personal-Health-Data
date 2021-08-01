const socketIO = require('socket.io')
const { io } = require('./controller/notification')
const app = require('./index.js');

PORT = process.env.PORT || 7000;

const server = app.listen(PORT, () => {
  console.log(`server started at localhost:${PORT}`);
});
const socket = socketIO(server, {
  path: '/notification/',
  cors: {
    origin: 'http://localhost:3000'
  }
})
io(socket)
