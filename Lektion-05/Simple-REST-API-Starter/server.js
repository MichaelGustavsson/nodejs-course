const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const productsRouter = require('./routes/products-routes');
const ErrorResponse = require('./utilities/ErrorResponseModel');

dotenv.config({ path: './config/config.env' });

const app = express();

// Middleware...
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(logger);
}

app.use('/api/v1/products', productsRouter);

// Catch all url...
app.all('*', (req, res, next) => {
  next(new ErrorResponse(`Kunde inte hitta resursen ${req.originalUrl}`, 404));
});

// Central felhantering...
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
