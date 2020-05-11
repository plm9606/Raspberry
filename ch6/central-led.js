const noble = require("@abandonware/noble");

noble.on("stateChange", function (state) {
  if (state === "poweredOn") {
    noble.startScanning(["ff10"]);
  } else {
    noble.startScanning();
  }
});

noble.on("discover", function (peripheral) {
  if (peripheral.advertisement.localName === "neogachon01") {
    console.log(`블루투스> 찾았음(discovery)----------------------`);
    console.log(`블루투스> 이름 ${peripheral.advertisement.localName}`);
    console.log(`블루투스> 주소: ${peripheral.address}`);
    console.log(`블루투스> 신호세기(Rssi): ${peripheral.rssi}`);
    console.log(`----------------------------------------------`);
    connectAndSetup(peripheral);
  }
});

function connectAndSetup(peripheral) {
  peripheral.connect(function (err) {
    const serviceUUIDs = ["ff10"];
    const characteristicsUUIDs = ["ff11"];
    peripheral.discoverSomeServicesAndCharacteristics(
      serviceUUIDs,
      characteristicsUUIDs,
      onServicesAndCharacteristicsDiscovered
    );
  });
}
