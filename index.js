const cors = require("cors");

const app = require("express")();
app.use(cors());

const httpServer = require("http").Server(app);
// const io = require("socket.io")(http);
const io = require("socket.io")(httpServer, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});
const port = process.env.PORT || 8080;

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg + " World!");
  });
  socket.on("game update", (room, body) => {
    console.log("game update ", room, body);
    socket.to(room).emit("game update", body);
  });
  socket.on("join room", (room, senderId, callback) => {
    console.log("player joining ", room, senderId, callback);
    socket.to(room).emit("start game", senderId);
    callback();
  });
});

httpServer.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

/* GET users listing. */
app.get("/database", function (req, res, next) {
  res.send({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" });
});
