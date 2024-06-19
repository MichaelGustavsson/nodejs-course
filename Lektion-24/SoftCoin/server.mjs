import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';
import Blockchain from './models/Blockchain.mjs';
import TransactionPool from './models/TransactionPool.mjs';
import Wallet from './models/Wallet.mjs';
import blockRouter from './routes/block-routes.mjs';
import blockchainRouter from './routes/blockchain-routes.mjs';
import transactionRouter from './routes/transaction-routes.mjs';
import PubNubServer from './pubnub-server.mjs';

// Import for demo purposes and seeding some wallets.

// Import av filhantering...
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: './config/config.env' });

// Skapa en global __appdir som motsvarar CommonJS __dirname...
const fileName = fileURLToPath(import.meta.url);
const dirname = path.dirname(fileName);
global.__appdir = dirname;

const credentials = {
  publishKey: 'pub-c-76fa24ce-de96-4c76-b5f5-bcef48d3d20b',
  subscribeKey: 'sub-c-5ced83b7-5714-4528-9038-5c0837d2fe18',
  secretKey: 'sec-c-NjUxZTRkZGEtMzZkMC00Mzk3LWEwYjMtOTY3MmNjZTZhMjg4',
  userId: 'michael-deploy-demo',
  // publishKey: process.env.PUBLISH_KEY,
  // subscribeKey: process.env.SUBSCRIBE_KEY,
  // secretKey: process.env.SECRET_KEY,
  // userId: process.env.USER_ID,
};

export const blockchain = new Blockchain();
export const transactionPool = new TransactionPool();
export const wallet = new Wallet();
export const pubnubServer = new PubNubServer({
  blockchain: blockchain,
  transactionPool: transactionPool,
  wallet: wallet,
  credentials: credentials,
});

const app = express();

// Middleware...
app.use(morgan('dev'));

// Body parser...
app.use(express.json());

// Sätt upp express för att hantera "static files"...
app.use(express.static(path.join(__appdir, 'public')));

// Lägg till säkerhets headers
app.use(helmet({ contentSecurityPolicy: false }));

// Förhindra Cross-Site-Scripting(XSS)
app.use(xss());

// Begränsa antal anrop under en tidsperiod(DDOS)
const limit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minuters fönster
  limit: 100,
});

app.use(limit);

// Aktivera CORS()...
app.use(cors());

// Förhindra HPP attacker(HTTP Parameter Pollution)
app.use(hpp());

// Definierar endpoints...
app.use('/api/v1/blockchain', blockchainRouter);
app.use('/api/v1/block', blockRouter);
app.use('/api/v1/wallet', transactionRouter);

const DEFAULT_PORT = process.env.PORT || 5001;
const ROOT_NODE = `http://localhost:${DEFAULT_PORT}`;

let NODE_PORT;

setTimeout(() => {
  pubnubServer.broadcast();
}, 1000);

const synchronize = async () => {
  let response = await fetch(`${ROOT_NODE}/api/v1/blockchain`);
  if (response.ok) {
    const result = await response.json();
    blockchain.replaceChain(result.data);
  }

  response = await fetch(`${ROOT_NODE}/api/v1/wallet/transactions`);
  if (response.ok) {
    const result = await response.json();
    transactionPool.replaceTransactionMap(result.data);
  }
};

if (process.env.GENERATE_NODE_PORT === 'true') {
  NODE_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = process.env.PORT || NODE_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`.yellow.underline);

  if (PORT !== DEFAULT_PORT) {
    synchronize();
  }
});
