// ES6 Import...
import express from 'express';
import cors from 'cors';
// Importera egna ES6 moduler...
import x from './product.mjs';

const app = express();

app.use(cors());

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
