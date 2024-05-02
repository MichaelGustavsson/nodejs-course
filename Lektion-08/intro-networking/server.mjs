import express from 'express';
import demoRouter from './routes/routes.mjs';

// console.log(process.argv[0]);
// console.log(process.argv[1]);
// console.log(process.argv[2]);
// console.log(process.argv[3]);

const PORT = process.argv[2];

const app = express();

// Middleware...
app.use('/api/v1/demo', demoRouter);

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
