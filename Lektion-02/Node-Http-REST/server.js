const http = require('http');
const uuid = require('uuid');

const products = [
  {
    id: '731085fc268c4a94966bcd1bc7c0e993',
    name: 'Råglimpa',
    price: 29.95,
    weight: '200g',
  },
  { id: '12c6a09826b840d6934f387d0091a9d7', name: 'Frökubb', price: 34.9, weight: '250g' },
  {
    id: '8f046897631e4bc9beff6f29e7d869fe',
    name: 'Kanel bulle',
    price: 28.9,
    weight: '400g',
  },
  {
    id: '11cabbdc1d7545c8877dcc312b18328c',
    name: 'Bondkaka',
    price: 39.95,
    weight: '230g',
  },
  {
    id: '453efde97a3a4edb864d7631f400532d',
    name: 'Finska pinnar',
    price: 34.75,
    weight: '240g',
  },
  {
    id: 'b22b93a01e064c2ab37399cf35c08c57',
    name: 'Finska pinnar',
    price: 34.75,
    weight: '240g',
  },
];
// Payload objekt
const responseModel = {
  success: false,
  statusCode: 404,
  error: 'Not Found',
  items: 0,
  data: null,
};

const server = http.createServer((req, res) => {
  let body = [];
  const { method, url } = req;

  req
    .on('data', (chunk) => {
      body.push(chunk);
    })
    .on('end', () => {
      body = Buffer.concat(body).toString();

      if (method === 'GET' && url === '/api/v1/products') {
        responseModel.statusCode = 200;
        responseModel.success = true;
        responseModel.error = null;
        responseModel.items = products.length;
        responseModel.data = products;
      } else if (method === 'POST' && url === '/api/v1/products') {
        const { name, price, weight } = JSON.parse(body);
        const id = uuid.v4().replaceAll('-', '');
        products.push({ id, name, price, weight });

        // Sätt ihop response objektet...
        responseModel.statusCode = 201;
        responseModel.success = true;
        responseModel.error = null;
        responseModel.data = products;
        responseModel.items = products.length;
      }

      res.writeHead(responseModel.statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(responseModel));
    });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
