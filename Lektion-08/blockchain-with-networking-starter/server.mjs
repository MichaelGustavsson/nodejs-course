import express from 'express';
import blockchainRouter from './routes/blockchain-routes.mjs';

const PORT = 5001;

const app = express();

// Middleware...
app.use(express.json());
app.use('/api/v1/blockchain', blockchainRouter);

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
