const express = require('express');
const uuid = require('uuid');

const app = express();

// Middleware...
app.use(express.json());

// DUMMY ARRAY AV PRODUKTER...
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
];

const responseModel = {
  success: false,
  statusCode: 404,
  error: 'Hittar inte!',
  items: 0,
  data: null,
};

// Endpoints...
// Hämta alla produkter...
app.get('/api/v1/products', (req, res) => {
  responseModel.data = products;
  responseModel.success = true;
  responseModel.error = null;
  responseModel.statusCode = 200;
  responseModel.items = products.length;

  res.status(200).json(responseModel);
});

// Hämta en produkt baserat på dess id...
app.get('/api/v1/products/:id', (req, res) => {
  const id = req.params.id;
  const product = products.find((p) => p.id === id);

  if (!product) {
    responseModel.error = `Kunde inte hitta någon produkt med id ${id}`;
    res.status(404).json(responseModel);

    return;
  }

  responseModel.data = product;
  responseModel.success = true;
  responseModel.error = null;
  responseModel.statusCode = 200;
  responseModel.items = 1;

  res.status(200).json(responseModel);
});

// Tar emot data(ny produkt)...
app.post('/api/v1/products', (req, res) => {
  const id = uuid.v4().replaceAll('-', '');
  req.body.id = id;
  products.push(req.body);

  responseModel.data = req.body;
  responseModel.success = true;
  responseModel.error = null;
  responseModel.statusCode = 201;
  responseModel.items = 1;

  res.status(201).json(responseModel);
});

// Uppdaterar en produkt till fullo...
app.put('/api/v1/products/:id', (req, res) => {
  const id = req.params.id;
  const product = products.find((p) => p.id === id);

  if (!product) {
    responseModel.error = `Kunde inte hitta någon produkt med id ${id}`;
    res.status(404).json(responseModel);

    return;
  }

  product.name = req.body.name ?? product.name;
  product.price = req.body.price ?? product.price;
  product.weight = req.body.weight ?? product.weight;

  res.status(204).end();
  // res.status(204).json({ success: true, statusCode: 204, items: 1, data: null });
});

// Endast uppdaterar priset på en produkt...
app.patch('/api/v1/products/:id', (req, res) => {
  const id = req.params.id;
  const product = products.find((p) => p.id === id);

  if (!product) {
    responseModel.error = `Kunde inte hitta någon produkt med id ${id}`;
    res.status(404).json(responseModel);

    return;
  }

  product.price = req.body.price ?? product.price;

  res.status(204).end();
});

// Ta bort en produkt baserat på dess id...
app.delete('/api/v1/products/:id', (req, res) => {
  // 1. Hämta in produkten med id som vi får i req.params.id
  const id = req.params.id;
  const product = products.find((p) => p.id === id);

  if (!product) {
    responseModel.error = `Kunde inte hitta någon produkt med id ${id} så det gick inte att ta bort`;
    res.status(404).json(responseModel);

    return;
  }

  // 2. Ta bort ur productslistan objektet som vi fick i steg 1.
  products.splice(products.indexOf(product), 1);

  res.status(204).end();
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
