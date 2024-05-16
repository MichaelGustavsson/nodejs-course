import redis from 'redis';

// Använder sig av kanaler(channels) publikationer
const CHANNELS = {
  DEMO: 'DEMO',
};

export default class RedisServer {
  constructor() {
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    // Glöm inte att prenumera på rätt! kanal...
    this.subscriber.subscribe(CHANNELS.DEMO);

    this.subscriber.on('message', (channel, message) =>
      this.messageHandler(channel, message)
    );
  }

  // Hjälp metoder...
  messageHandler(channel, message) {
    console.log(
      `Meddelande mottaget på kanalen: ${channel} och medelandet är: ${message}`
    );
  }

  publish({ channel, message }) {
    this.publisher.publish(channel, message);
  }
}

// const test = new RedisServer();
// setTimeout(() => {
//   console.log('Är in timeout');
//   test.publisher.publish(CHANNELS.DEMO, 'Hej på Er!');
// }, 1000);
