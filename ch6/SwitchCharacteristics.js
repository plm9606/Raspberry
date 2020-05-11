const bleno = require("@abandonware/bleno");
const gpio = require("node-wiring-pi");

class SwitchCharacteristic extends bleno.Characteristic {
  constructor(ledState, LED) {
    super.call(this, {
      uuid: "ff11",
      properties: ["read", "write"],
      descriptors: [
        new bleno.Descriptor({
          uuid: `2901`,
          value: "Switch",
        }),
      ],
    });
    this.LED = LED;
    this.ledState = ledState;
  }

  onReadRequest(offset, cb) {
    let data = Buffer.alloc(1);
    console.log(`블루투스> 데이터 수신(read 요청)`);
    data[0] = this.ledState;
    cb(this.RESULT_SUCCESS, data); // central기기로 data 전송
  }

  onWriteRequest(data, offset, withoutResponse, cb) {
    if (data[0]) {
      // central에서 온 data가 1이라면
      console.log(
        `블루투스> 데이터수신(read요청) ${data.toString("hex")} (LED ON)`
      );
      this.ledState = 1;
      gpio.digitalWrite(this.LED, this.ledState);
    } else {
      this.ledState = 0;
      console.log(
        `블루투수> 데이터수신(read요청) ${data.toString("hex")} (LED OFF)`
      );
      gpio.digitalWrite(this.LED, this.ledState);
    }

    cb(this.RESULT_SUCCESS); //central기기로 응답(성공) 전송
  }
}

module.exports = SwitchCharacteristic;
