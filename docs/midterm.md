[gpio](#gpio)

[neoPixel](#neoPixel)

[ADC](#ADC)

# gpio

`const gpio = require("node-wiring-pi")`

## wiringPiSetup();

wiringPi를 초기화

## pinMode(pin, mode);

`mode`

- `gpio.OUTPUT``
- `gpio.INPUT`

## digitalRead(pin)

핀에서 읽은 값은 리턴
`HIGH`(1) or `LOW`(0)

## digitalWrite(pin, state);

`state`

- `HIGH`(1)
- `LOW`(0)

## delay(milliseconds)

## delayMicroseconds(microseconds)

## mills()

Returns the number of milliseconds since the beginning running of the current program

## micros()

Returns the number of microseconds since the beginning running of the current program

## wiringPiISR(pin, edgeType, callbask);

기존의 무한반복(polling) 대신에, 인터럽트 처리방식으로 센서측정하는 기법
지정된 핀에서 지정된 인터럽트가 발생되면 콜백함수가 호출된다.
버튼에서 사용. (ex. `gpio.wiringPiISR(BUTTON, gpio.INT_EDGE_FALLING, detectButton)`)

**edgeType**
![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fk.kakaocdn.net%2Fdn%2FbjR7K3%2FbtqyUhhTWhW%2FwB5vlq0EKo4skQwGH80P50%2Fimg.png)

- `INT_EDGE_FALLING`
- `INT_EDGE_RISING`
- `INT_EDGE_BOTH`
- `INT_EDGE_SETUP`

# neoPixel

`const ws281x = require("@bartando/rpi-ws281x-neopixel");`

## init(options)

**options**

- count
- stripType

ex. `ws281x.init({ count: NUM_LEDS, stripType: ws281x.WS2811_STRIP_GRB })`

## setPixelColor(position, {r, g, b})

## setBrightness(brightness)

birghtness is `0` to `100`

## getPixelColor: function (position) {}

## show()

LED를 켠다

## reset()

모든 LED를 끈다

# ADC

`const mcpadc = require("mcp-spi-adc");`

## open(channel[, options], cb)

## openMcp3208(channel[, options], cb)

비동기로 adc채널을 open한다.

`Returns`

- a new AdcChannel object

`params`

- channel - the number of the channel to open, see channel numbers in supported devices
- options - an optional object specifying channel configuration options
- cb - completion callback

```js
mcpadc.openMcp3208(LIGHT, { speedHz }, (err) => {
  console.log(`SPI 채널0 초기화 완료`);
  if (err) console.log(`채널 0 초기화 실패`);
});
```

## adcChannel.read(cb)

Asynchronous read.

`Params`

- cb - `(err, reading)` 2개의 agument를 갖는다.

  - `reading`은 0과 1사이의 값인 `value`와 채널에서 읽은 값인 `rawValue`로 구성된 객체다.

## adcChannel.close(cb)

Asynchronous close.

- cb - completion callback `(err)=>{}`

# bleno

> advertiser(peripheral)용 모듈

## Advertising

### startAdvertising(name, serviceUuids[, callback(error)])

\*\* 주의할점
반드시 poweredOn상태인지를 확인해야 한다.

name

- maximum 26 bytes

service UUID's

- 1 128-bit service UUID
- 1 128-bit service UUID + 2 16-bit service UUID's
- 7 16-bit service UUID

### bleno.stopAdvertising([callback]);

## Events

`bleno.on(EVENT, callback)`

### stateChange

블루투스 연결 상태 변화 감지

```js
state = <"unknown" | "resetting" | "unsupported" | "unauthorized" | "poweredOff" | "poweredOn">

bleno.on('stateChange', callback(state));
```

### advertisingStart

advertising 시작을 감지

`bleno.on('advertisingStart', callback(error));`

### advertisingStop

advertising 종료를 감지

`bleno.on('advertisingStop', callback);`

### accept

상대(central)가 수신 허용함

`bleno.on('accept', callback(clientAddress)); // not available on OS X 10.9`

### disconnect

상대가 수신 종료함

`bleno.on('disconnect', callback(clientAddress)); // Linux only`

### rssiUpdate

`bleno.on('rssiUpdate', callback(rssi)); // not available on OS X 10.9`

## Characteristic

```js
var Characteristic = bleno.Characteristic;

var characteristic = new Characteristic({
    uuid: 'fffffffffffffffffffffffffffffff1', // or 'fff1' for 16-bit
    properties: [ ... ], // 'read', 'write', 'writeWithoutResponse', 'notify', 'indicate'
    secure: [ ... ], // enable security for properties
    value: null, // optional static value, must be of type Buffer - for read only characteristics
    descriptors: [
        // see Descriptor for data type
    ],
    onReadRequest: null, // optional read request handler, function(offset, callback) { ... }
    onWriteRequest: null, // optional write request handler, function(data, offset, withoutResponse, callback) { ...}
    onSubscribe: null, // optional notify/indicate subscribe handler, function(maxValueSize, updateValueCallback) { ...}
    onUnsubscribe: null, // optional notify/indicate unsubscribe handler, function() { ...}
    onNotify: null, // optional notify sent handler, function() { ...}
    onIndicate: null // optional indicate confirmation received handler, function() { ...}
});
```

### Result codes

- Characteristic.`RESULT_SUCCESS`
- Characteristic.`RESULT_INVALID_OFFSET`
- Characteristic.`RESULT_INVALID_ATTRIBUTE_LENGTH`
- Characteristic.`RESULT_UNLIKELY_ERROR`

### Read requests

Can specify read request handler via constructor options or by extending Characteristic and overriding onReadRequest.

Parameters to handler are

- offset (0x0000 - 0xffff)
- callback

  callback must be called with result and data (of type Buffer) - can be async.

```js
var result = Characteristic.RESULT_SUCCESS;
var data = new Buffer( ... );

callback(result, data);
```

### Write requests

Can specify write request handler via constructor options or by extending Characteristic and overriding onWriteRequest.

Parameters to handler are

- data (Buffer)
- offset (0x0000 - 0xffff)
- withoutResponse (true | false)
- callback

callback must be called with result code - can be async.

```js
var result = Characteristic.RESULT_SUCCESS;

callback(result);
```

## Primary Service

```js
var PrimaryService = bleno.PrimaryService;

var primaryService = new PrimaryService({
  uuid: "fffffffffffffffffffffffffffffff0", // or 'fff0' for 16-bit
  characteristics: [
    // see Characteristic for data type
  ],
});
```

# noble

> observer(central)용 모듈
