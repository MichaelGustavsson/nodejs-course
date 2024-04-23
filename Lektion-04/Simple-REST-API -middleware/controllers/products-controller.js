const uuid = require('uuid');
const products = require('../model/Products');
const ResponseModel = require('../model/ResponseModel');

const listProducts = (req, res) => {
  // console.log(req.user, req.role);

  res.status(200).json(new ResponseModel({ statusCode: 200, data: products }));
};

const findProduct = (req, res) => {
  // console.log(req.user, req.role);
  const id = req.params.id;
  const product = products.find((p) => p.id === id);

  if (!product) {
    res.status(404).json(
      new ResponseModel({
        statusCode: 404,
        error: `Kunde inte hitta någon produkt med id ${id}`,
      })
    );

    return;
  }

  res.status(200).json(new ResponseModel({ statusCode: 200, data: product }));
};

const addProduct = (req, res) => {
  const id = uuid.v4().replaceAll('-', '');
  req.body.id = id;
  products.push(req.body);

  res.status(201).json(new ResponseModel({ statusCode: 201, data: req.body }));
};

const updateProduct = (req, res) => {
  const id = req.params.id;
  const product = products.find((p) => p.id === id);

  if (!product) {
    res.status(404).json(
      new ResponseModel({
        statusCode: 404,
        error: `Kunde inte uppdatera hittade ingen produkt med id ${id}`,
      })
    );

    return;
  }

  product.name = req.body.name ?? product.name;
  product.price = req.body.price ?? product.price;
  product.weight = req.body.weight ?? product.weight;

  res.status(204).end();
};

const updateProductPrice = (req, res) => {
  const id = req.params.id;
  const product = products.find((p) => p.id === id);

  if (!product) {
    res.status(404).json(
      new ResponseModel({
        statusCode: 404,
        error: `Kunde inte uppdatera, hittade ingen produkt med id ${id}`,
      })
    );

    return;
  }

  product.price = req.body.price ?? product.price;

  res.status(204).end();
};

const deleteProduct = (req, res) => {
  const id = req.params.id;
  const product = products.find((p) => p.id === id);

  if (!product) {
    res.status(404).json(
      new ResponseModel({
        statusCode: 404,
        error: `Kunde inte hitta någon produkt med id ${id} så det gick inte att ta bort`,
      })
    );

    return;
  }

  products.splice(products.indexOf(product), 1);

  res.status(204).end();
};

module.exports = {
  addProduct,
  deleteProduct,
  findProduct,
  listProducts,
  updateProduct,
  updateProductPrice,
};
