// ES6 imports...
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import logger from './middleware/logger.mjs';
import errorHandler from './middleware/errorHandler.mjs';
import productsRouter from './routes/products-routes.mjs';
import customersRouter from './routes/customers-routes.js';
import ErrorResponse from './utilities/ErrorResponseModel.mjs';

// Lösningen på att få tag i __dirname för ES6 modul laddaren...
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: './config/config.env' });

const app = express();

// Placera rotsökvägen i node.js globala objekt...
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

global.__appdir = dirname;

// Middleware...
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(logger);
}

app.use('/api/v1/products', productsRouter);
app.use('/api/v1/customers', customersRouter);

// Catch all url...
app.all('*', (req, res, next) => {
  next(new ErrorResponse(`Kunde inte hitta resursen ${req.originalUrl}`, 404));
});

// Central felhantering...
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
