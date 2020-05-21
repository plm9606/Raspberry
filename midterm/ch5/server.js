const http = require("http");
const fs = require("fs");
const server = http.createServer();
const PORT = 8080;

server.on("request", (req, res) => {
  console.log("Request on");
  fs.readFile("views/test.html", "utf8", (err, data) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

module.exports = server;
