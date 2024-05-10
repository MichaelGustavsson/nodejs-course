import express from 'express';
import cors from 'cors';
import blockchainRouter from './routes/blockchain-routes.mjs';
import memberRouter from './routes/member-routes.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

// Hämta in port ifrån package.json
const PORT = process.argv[2];

const app = express();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

global.__appdir = dirname;

// Middleware...
app.use(cors());
app.use(express.json());

// Definiera endpoints...
app.use('/api/v1/blockchain', blockchainRouter);
app.use('/api/v1/members', memberRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  console.log('TODO: Sync at startup');
  syncAtStartup();
});

const syncAtStartup = async () => {
  console.log(process.argv[3]);
  const response = await fetch(
    `${process.argv[3]}/api/v1/blockchain/concensus`
  );
  if (response.ok) {
    const result = await response.json();
    console.log(result);
  } else {
    console.log('Oops något gick fel!!!');
  }
};
