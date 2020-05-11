const gpio = require("node-wiring-pi");
const bleno = require("@abandonware/bleno");
const ws281x = require("@bartando/rpi-ws281x-neopixel");
const util = require("util");
const LED_COUNT = 12;
let ledState = 0; // led 켜진 상태
let nodeName = "neogachon01";
const POWERED_ON = "poweredOn";

let PrimaryService = bleno.PrimaryService;
let Charactteristic = bleno.Characteristic;

ws281x.init({ count: NUM_LEDS, stripType: ws281x.WS2811_STRIP_GRB });
ws281x.setBrightness(10);

const switchCharacteristic = function () {
  switchCharacteristic.super_.call(this, {
    uuid: "ff11",
    properties: ["read", "write"],
    descriptors: [
      new bleno.Descriptor({
        uuid: `2901`,
        value: "Switch",
      }),
    ],
  });
};

util.inherits(switchCharacteristic, Charactteristic);

// central에서 read request를 실행하면 peripheral에서 이 함수 실행됨
switchCharacteristic.prototype.onReadRequest = (offset, cb) => {
  let data = Buffer.alloc(1);
  console.log(`블루투스> 데이터 수신(read 요청)`);
  data[0] = ledState;
  cb(this.RESULT_SUCCESS, data); // central기기로 data 전송
};

switchCharacteristic.prototype.onWriteRequest = (
  data,
  offset,
  withoutResponse,
  cb
) => {
  if (data[0] == 1) {
    // central에서 온 data가 1이라면
    console.log(
      `블루투스> 데이터수신(read요청) ${data.toString("hex")} (LED RED)`
    );
    ledState = 1;
  } else if (data[0] == 2) {
    ledState = 2;
    console.log(
      `블루투스> 데이터수신(read요청) ${data.toString("hex")} (LED GREEN)`
    );
  } else {
    ledState = 3;
    console.log(
      `블루투스> 데이터수신(read요청) ${data.toString("hex")} (LED GREEN)`
    );
  }

  cb(this.RESULT_SUCCESS); //central기기로 응답(성공) 전송
};

const lightService = new PrimaryService({
  uuid: "ff10",
  characteristics: [new switchCharacteristic()],
});

bleno.on("stateChange", function (state) {
  if (state === POWERED_ON) {
    bleno.startAdvertising(nodeName, [lightService.uuid]);
    console.log("------------------------------------");
    console.log(`블루투스> ON (${nodeName} 가동)`);
  } else {
    bleno.stopAdvertising();
    console.log(`블루투스> Advertising 중단`);
  }
});

bleno.on("accept", function (addr) {
  console.log(`블루투스> 상대편(${addr})이 연결을 수락했습니다. `);
  setInterval(() => {
    bleno.updateRssi((err, rssi) => {
      console.log(
        `수신감도(3초마다): 2m이내(-20 ~ -50), 3~7m(-60 ~ -80), 8m이상(-90 ~ -120) > ${rssi}`
      );

      setNeoPixel(rssi);
    });
  }, 3000);
});

bleno.on("disconnect", function (addr) {
  console.log(`블루투스> 상대편 (${addr})이 연결을 끊었습니다. `);
});

bleno.on("advertisingStart", function (err) {
  if (!err) {
    console.log(`블루투스> Advertising을 시작합니다`);
    console.log("--------------------------------------");
    bleno.setServices([lightService]);
  } else {
    console.log(`블루투스> Advertising도중 오류 발생`);
  }
});

function exit() {
  console.log(`블루투스> 프로그램을 종료합니다`);
  process.exit();
}

function setNeoPixel(rssi) {
  const activeLedCount = 12 - Math.abs(-(rssi + 20) / 2);
  for (let i = 0; i < activeLedCount; i++) {
    ws281x.setPixelColor(i, ledStateToRgb());
    ws281x.show();
    gpio.delay(1);
  }

  for (let i = activeLedCount; i < LED_COUNT; i++) {
    ws281x.setPixelColor(i, { r: 0, g: 0, b: 0 });
    ws281x.show();
    gpio.delay(1);
  }
}

function ledStateToRgb() {
  if (ledState == 1) return { r: 100, g: 0, b: 0 };
  if (ledState == 2) return { r: 0, g: 100, b: 0 };
  if (ledState == 3) return { r: 0, g: 0, b: 100 };
  else return { r: 100, g: 100, b: 100 };
}

process.on("SIGINT", exit);
gpio.wiringPiSetup();
gpio.pinMode(LED, gpio.OUTPUT);
