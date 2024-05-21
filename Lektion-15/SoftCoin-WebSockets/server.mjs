import express from 'express';
import Blockchain from './models/Blockchain.mjs';
import blockRouter from './routes/block-routes.mjs';
import blockchainRouter from './routes/blockchain-routes.mjs';
import WSServer from './websocketServer.mjs';

export const blockchain = new Blockchain();
export const wsServer = new WSServer({ blockchain: blockchain });

const app = express();
app.use(express.json());

app.use('/api/v1/blockchain', blockchainRouter);
app.use('/api/v1/block', blockRouter);

const synchronize = async () => {
  const response = await fetch(`${ROOT_NODE}/api/v1/blockchain`);
  if (response.ok) {
    const result = await response.json();
    blockchain.replaceChain(result.data);
  }
};

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  wsServer.listen();
});
