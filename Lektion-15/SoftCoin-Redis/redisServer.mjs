import redis from 'redis';

// Använder sig av kanaler(channels) publikationer
const CHANNELS = {
  DEMO: 'DEMO',
  BLOCKCHAIN: 'BLOCKCHAIN',
};

export default class RedisServer {
  constructor({ blockchain }) {
    this.blockchain = blockchain;

    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    // Glöm inte att prenumera på rätt! kanal...
    // this.subscriber.subscribe(CHANNELS.DEMO);
    this.loadChannels();

    this.subscriber.on('message', (channel, message) =>
      this.messageHandler(channel, message)
    );
  }

  broadcast() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }
  // Hjälp metoder...
  loadChannels() {
    Object.values(CHANNELS).forEach((channel) =>
      this.subscriber.subscribe(channel)
    );
  }

  messageHandler(channel, message) {
    // console.log(
    //   `Meddelande mottaget på kanalen: ${channel} och meddelandet är: ${message}`
    // );

    const msg = JSON.parse(message);

    if (channel === CHANNELS.BLOCKCHAIN) {
      console.log('REPLACE IS IN PROGRESS', msg);
      this.blockchain.replaceChain(msg);
    }
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
