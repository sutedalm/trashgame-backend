const cors = require("cors");
const mysql = require("mysql2");
const env = process.env;

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

sql_config = {
  host: 'db4free.net',
  user: 'fitzels',
  password: env.SQL_PASSWORD,
  database: 'fitzels',
}

async function query(sql, params) {
  const connection = await mysql.createConnection(sql_config);
  const results = await connection.execute(sql, params);

  return results;
}

/* GET users listing. */
app.get("/update_score", function (req, res, next) {
  const result = query(
      `INSERT INTO scores (user, highscore) VALUES (?, ?) ON DUPLICATE KEY UPDATE highscore=GREATEST(highscore, VALUES(highscore));`,
      [req.query.user, req.query.score]
  );
  res.send({status: "success"});
});
