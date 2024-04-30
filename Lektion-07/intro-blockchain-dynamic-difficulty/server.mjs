import express from 'express';
import blockchainRouter from './routes/blockchain-routes.mjs';

const app = express();

// Middleware...
// Konvertera request objektets body paket till json...
app.use(express.json());
app.use('/api/v1/blockchain', blockchainRouter);
// Hämta in port som ska användas eller använd en default...
const PORT = process.env.PORT || 5010;

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
