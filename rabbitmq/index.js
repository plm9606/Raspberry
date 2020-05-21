const amqp = require("amqplib/callback_api");

const {
  RABBITMQ_HOST: hostname,
  RABBITMQ_PORT: port,
  RABBITMQ_USER: user,
  RABBITMQ_PASS: password,
} = process.env;

let conn = null;

module.exports = {
  connect: (cb) => {
    amqp.connect(
      {
        protocol: "amqp",
        hostname,
        port,
        username,
        password,
        locale: "en)US",
        vhost: "/",
      },
      (err, connection) => {
        if (err) return cb(error);
      }
    );
  },
  reeciveData: ({ queueName }, cb) => {},
  sendData: ({ queueName, data }) => {
    conn.createChannel((err, channel) => {
      if (err) return console.log(err);

      channel.sendToQueue(queueName, new Buffer(JSON.stringify(data)));
    });
  },
};
