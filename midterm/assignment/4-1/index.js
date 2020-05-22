const ws281x = require("@bartando/rpi-ws281x-neopixel");
const bleno = require("@abandonware/bleno");
const util = require("util");

// neopixel initializing
ws281x.init({ count: 12, stripType: ws281x.WS2811_STRIP_GRB });
ws281x.setBrightness(10);

process.on("SIGINT", () => {
  ws281x.reset();
  process.exit();
});

// characteristic
function LedCharacteristic() {
  bleno.Characteristic.call(this, {
    uuid: "ff10",
    discriptors: [
      new bleno.Descriptor({
        uuid: "ff11",
        properties: ["read", "write"],
        value: "hi",
      }),
    ],
  });
}
util.inherits(LedCharacteristic, bleno.Characteristic);
// central에게 data 전송. central이 read를 요청함.
LedCharacteristic.prototype.onReadRequest = (offset, cb) => {
  const data = Buffer.alloc(1);
  data[0] = 1;
  cb(this.RESULT_SUCCESS, data);
};

// central에게 온 데이터 처리. central이 write를 요청함.
LedCharacteristic.prototype.onWriteRequest = (
  data,
  offset,
  withoutResponse,
  cb
) => {
  if (data) {
  }
  cb(this.RESULT_SUCCESS);
};

// service
function LedService() {
  bleno.PrimaryService(this, {
    uuid: "ff12",
    characteristics: [new LedCharacteristic()],
  });
}
util.inherits(LedService, bleno.PrimaryService);

// peripheral
const ledService = new LedService();
bleno.on("stateChange", (state) => {
  if (state === "poweredOn") {
    bleno.startAdvertising(NODE_NAME, [ledService.uuid]);
  } else {
    bleno.stopAdvertising();
  }
});
bleno.on("advertisingStart", (err) => {});
bleno.on("accept", (clentAddr) => {});
bleno.on("disconnect", (clientAddr) => {});
