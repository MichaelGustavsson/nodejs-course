import { WebSocketServer, WebSocket } from 'ws';

const NODE_PORT = process.env.NODE_PORT || 5001;
// ws://localhost:5001, ws://localhost:5002, ws://localhost:5002
const NODES = process.env.MEMBER_NODES
  ? process.env.MEMBER_NODES.split(',')
  : [];

export default class WSServer {
  constructor({ blockchain }) {
    this.blockchain = blockchain;
    this.nodes = [];
  }

  listen() {
    const server = new WebSocketServer({ port: NODE_PORT });

    server.on('connection', (node) => this.connectNode(node));

    this.connectToNodes();

    console.log(`Lyssnar på anslutningar på port: ${NODE_PORT}`);
  }

  connectToNodes() {
    NODES.forEach((node) => {
      const socket = new WebSocket(node);
      socket.on('open', () => this.connectNode(socket));
    });
  }

  connectNode(node) {
    this.nodes.push(node);

    console.log('Node är ansluten');

    this.messageHandler(node);

    node.send(JSON.stringify({ chain: this.blockchain.chain }));
  }

  messageHandler(node) {
    node.on('message', (message) => {
      const msg = JSON.parse(message);

      this.blockchain.replaceChain(msg.chain);
    });
  }

  send(node) {
    node.send(JSON.stringify({ chain: this.blockchain.chain }));
  }

  synchronize() {
    this.nodes.forEach((node) =>
      node.send(JSON.stringify({ chain: this.blockchain.chain }))
    );
  }
}
