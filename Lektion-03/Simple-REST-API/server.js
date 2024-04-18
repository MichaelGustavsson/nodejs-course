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

// Endpoints...
// Hämta alla produkter...
app.get('/api/v1/products', (req, res) => {
  res.status(200).json({ success: true, statusCode: 200, items: products.length, data: products });
});

// Hämta en produkt baserat på dess id...
app.get('/api/v1/products/:id', (req, res) => {
  const id = req.params.id;
  const product = products.find((p) => p.id === id);

  res.status(200).json({ success: true, statusCode: 200, items: 1, data: product });
});

// Tar emot data(ny produkt)...
app.post('/api/v1/products', (req, res) => {
  const id = uuid.v4().replaceAll('-', '');
  req.body.id = id;
  products.push(req.body);

  res.status(201).json({ success: true, statusCode: 201, items: 1, data: req.body });
});

// Uppdaterar en produkt till fullo...
app.put('/api/v1/products/:id', (req, res) => {
  const id = req.params.id;
  const product = products.find((p) => p.id === id);

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

  product.price = req.body.price ?? product.price;

  res.status(204).end();
});

// Ta bort en produkt baserat på dess id...
app.delete('/api/v1/products/:id', (req, res) => {
  res.json({ message: 'DELETE funkar!' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
