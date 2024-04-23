const express = require('express');
const productsRouter = require('./routes/products-routes');

const app = express();

// Middleware...
app.use(express.json());
app.use('/api/v1/products', productsRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
