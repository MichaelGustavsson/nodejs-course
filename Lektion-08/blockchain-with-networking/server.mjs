import express from 'express';
import blockchainRouter from './routes/blockchain-routes.mjs';
import memberRouter from './routes/member-routes.mjs';

const PORT = process.argv[2];

const app = express();

// Middleware...
app.use(express.json());
// Definierar endpoints...
app.use('/api/v1/blockchain', blockchainRouter);
app.use('/api/v1/members', memberRouter);

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
