import express from 'express';
import cors from 'cors';
import blockchainRouter from './routes/blockchain-routes.mjs';
import transactionRouter from './routes/transaction-routes.mjs';
import memberRouter from './routes/member-routes.mjs';

// Hämta in port ifrån package.json
const PORT = process.argv[2];

const app = express();

// Middleware...
app.use(cors());
app.use(express.json());

// Definiera endpoints...
app.use('/api/v1/blockchain', blockchainRouter);
app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/members', memberRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
