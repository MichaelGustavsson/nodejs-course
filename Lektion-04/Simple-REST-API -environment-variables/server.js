const express = require('express');
const dotenv = require('dotenv');
const productsRouter = require('./routes/products-routes');

dotenv.config({ path: './config/config.env' });

const app = express();

// Middleware...
app.use(express.json());
app.use('/api/v1/products', productsRouter);

if (process.env.NODE_ENV === 'development') {
  console.log('Jag är i utvecklingsmiljön');
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
