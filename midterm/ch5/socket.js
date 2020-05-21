const server = require("./server");
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  socket.emit("watch", { val: Math.random() });
});
