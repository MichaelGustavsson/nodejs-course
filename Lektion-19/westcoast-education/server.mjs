import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth-routes.mjs';

import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './middleware/errorHandler.mjs';

// Konfigurerar dotenv...
dotenv.config({ path: './config/config.env' });

// Skapa en global __appdir som motsvarar CommonJS __dirname...
const fileName = fileURLToPath(import.meta.url);
const dirname = path.dirname(fileName);
global.__appdir = dirname;

const app = express();

// Middleware...
app.use(express.json());
app.use('/api/v1/auth', authRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5010;

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
