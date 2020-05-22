const noble = require("@abandonware/noble");

noble.on("stateChange", (status) => {
  if (status === "poweredOn") {
    noble.startScanning(["ff20"]);
  } else noble.stopScanning();
});

noble.on("discover", (peripheral) => {
  if (peripheral.advertisement.localName == NODE_NAME) {
    console.log(`블루투스 찾음(discovery)`);
    console.log(`블루투스 이름 > ${peripheral.advertisement.localName}`);
    console.log(`블루투스 주소 > ${peripheral.address}`);
    console.log(`블루투스 신호세기(rssi) > ${peripheral.rssi}`);

    connectAndSetup(peripheral);
  }
});

function connectAndSetup(peripheral) {
  const serviceUUIDs = ["ff10"];
  const characteristicsUUIDs = ["ff11"];
  peripheral.discoverSomeServicesAndCharacteristics(
    serviceUUIDs,
    characteristicsUUIDs,
    onServiceAndCharacteristicsDiscovered
  );
}

function onServiceAndCharacteristicsDiscovered(err, services, characteristics) {
  if (err) throw err;

  const switchCharacteristic = characteristics[0];

  function sendData(byte) {
    const buffer = Buffer.alloc(1);
    buffer[0] = byte;

    console.log(`블루투스 데이터 전송(write): ${byte}`);

    switchCharacteristic.write(buffer, false, (err) => {
      if (err) console.log(err);
    });
  }

  function remoteLedOn() {
    sendData(0x01);
    setTimeout(remoteLedOff, 2000);
  }

  function remoteLedOff() {
    sendData(0x00);
    setTimeout(remoteLedOn, 2000);
  }

  remoteLedOn();
}
