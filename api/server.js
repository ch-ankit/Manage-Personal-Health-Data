const socketIO = require("socket.io");
const app = require("./index.js");
const driver = require("./database");

PORT = process.env.PORT || 7000;

const server = app.listen(PORT, () => {
  console.log(`server started at localhost:${PORT}`);
  var session = driver.session();
  session
    .run(`MATCH(n:Socketuser) DELETE n`)
    .then(() => {
      console.log("Users Removed");
    })
    .catch((err) => console.log(err));

});
const io = socketIO(server, {
  path: "/notification/",
  cors: {
    origin: "http://localhost:3000",
  },
});
let socketUsers = [];

const removeUsers = (socketId) => {
  socketUsers = socketUsers.filter((user) => user.socketId !== socketId);
  var session = driver.session();
  session
    .run(`MATCH(n:Socketuser{socketId:$socketId}) DETACH DELETE n`, {
      socketId: socketId,
    })
    .then(() => {
      console.log("user Removed");
    })
    .catch((err) => console.log(err));
};


const addUsers = (userId, socketId) => {
  // !socketUsers.some((user) => user.userId == userId) &&
  //   socketUsers.push({ userId, socketId })
  if (!socketUsers.some((user) => user.userId == userId)) {
    socketUsers.push({ userId, socketId });
    var session = driver.session();
    session
      .run(`MERGE(n:Socketuser{userId:$userId,socketId:$socketId})`, {
        userId: userId,
        socketId: socketId,
      })
      .then(() => {
        console.log("user added");
      })
      .catch((err) => console.log(err));
  }
}
io.on('connection', (socket) => {
  // console.log('Connected to server')
  socket.on('addUser', userId => {
    console.log(userId)
    addUsers(userId, socket.id)
    io.emit('getUsers', socketUsers)
  })
  // send and get notification
  socket.volatile.on('disconnect', () => {
    console.log('A user disconnected')
    removeUsers(socket.id)
    io.emit('getUsers', socketUsers)
  })
})

app.set('socketServer', io)
