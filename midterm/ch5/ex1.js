const gpio = require("node-wiring-pi");
const mcpadc = require("mcp-spi-adc");
const socketio = require("socket.io");
const server = require("./server");

const CS_MCP3208 = 10, // CE0 is set
  speedHz = 1000000, // colck speed = 1Mhz
  LIGHT = 0; // adc 0번째 채널 선택 = 아날로그센서

let timerId;
let lightdata = -1; // 조도값 측정데이터 저장용

// 센서와 핀 초기화
gpio.wiringPiSetup();
gpio.pinMode(CS_MCP3208, gpio.OUTPUT);

const lightSensor = mcpadc.open(LIGHT, { speedHz }, (err) => {
  if (err) throw err;
  analogLight();
});

// socket server
const socketServer = socketio.listen(server);
socketServer.on("connection", (socket) => {
  socket.on("startmsg", (data) => {
    console.log("가동메세지 수신");
  });

  socket.on("stopmsg", () => {
    console.log("중지 메세지 수신");
  });
});

process.on("SIGINT", () => {
  console.log(`MCP-ADC가 해제되어, 웹서버를 종료합니다`);
  process.exit();
});

function analogLight() {
  lightSensor.read((err, reading) => {
    if (err) throw err;

    console.log(reading.rawValue);

    if (reading.rawValue != -1) {
      console.log(`${(reading.rawValue / 4095) * 100}%`);
      socketServer.emit("watch", reading.rawValue);
    }
  });
  setTimeout(analogLight, 1000);
}
