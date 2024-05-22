import PubNub from 'pubnub';

const CHANNELS = {
  DEMO: 'DEMO',
  BLOCKCHAIN: 'BLOCKCHAIN',
};

const credentials = {
  publishKey: 'pub-c-76fa24ce-de96-4c76-b5f5-bcef48d3d20b',
  subscribeKey: 'sub-c-5ced83b7-5714-4528-9038-5c0837d2fe18',
  secretKey: 'sec-c-ZTA3ZDI4ZmItNDUyNC00NGJjLWJkMjAtNGI1N2Q2ODk0YWI4',
  userId: 'michael-test',
};

export default class PubNubServer {
  constructor({ blockchain }) {
    this.blockchain = blockchain;
    this.pubnub = new PubNub(credentials);
    this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
    this.pubnub.addListener(this.listener());
  }

  broadcast() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
    // this.publish({ channel: CHANNELS.BLOCKCHAIN, message: 'Hej på Er' });
  }

  listener() {
    return {
      message: (msgObject) => {
        const { channel, message } = msgObject;
        const msg = JSON.parse(message);
        console.log(msg);

        console.log(
          `Meddelande mottagits på kanal: ${channel}, meddelande: ${message}`
        );

        if (channel === CHANNELS.BLOCKCHAIN) {
          this.blockchain.replaceChain(msg);
        }
      },
    };
  }

  publish({ channel, message }) {
    this.pubnub.publish({ channel, message });
  }
}
