import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './config/mongo.mjs';
import colors from 'colors';
import morgan from 'morgan';
import authRouter from './routes/auth-routes.mjs';
import coursesRouter from './routes/courses-routes.mjs';
import usersRouter from './routes/user-routes.mjs';

import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './middleware/errorHandler.mjs';

// Konfigurerar dotenv...
dotenv.config({ path: './config/config.env' });

// Anslut till MongoDB...
connectDb();

// Skapa en global __appdir som motsvarar CommonJS __dirname...
const fileName = fileURLToPath(import.meta.url);
const dirname = path.dirname(fileName);
global.__appdir = dirname;

const app = express();

// Middleware...
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/courses', coursesRouter);
app.use('/api/v1/users', usersRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5010;

const server = app.listen(PORT, () =>
  console.log(`Server is running on port: ${PORT}`.yellow)
);

// Hantera fel(Rejections) som inte hanteras någon annanstans i applikation...
process.on('unhandledRejection', (err, promise) => {
  console.log(`FEL: ${err.message}`.red);
  server.close(() => process.exit(1));
});
