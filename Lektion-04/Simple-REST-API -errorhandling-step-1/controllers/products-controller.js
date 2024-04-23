const uuid = require('uuid');
const products = require('../model/Products');
const ResponseModel = require('../model/ResponseModel');

const listProducts = (req, res) => {
  // throw new Error('Hoppsan det gick galet!');
  try {
    res.status(200).json(new ResponseModel({ statusCode: 200, data: products }));
  } catch (error) {
    res.status(500).json(new ResponseModel({ statusCode: 500, error: 'Internal Server Error' }));
  }
};

const findProduct = (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json(new ResponseModel({ statusCode: 500, error: 'Internal Server Error' }));
  }
};

const addProduct = (req, res) => {
  try {
    const id = uuid.v4().replaceAll('-', '');
    req.body.id = id;
    products.push(req.body);

    res.status(201).json(new ResponseModel({ statusCode: 201, data: req.body }));
  } catch (error) {
    res.status(500).json(new ResponseModel({ statusCode: 500, error: 'Internal Server Error' }));
  }
};

const updateProduct = (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json(new ResponseModel({ statusCode: 500, error: 'Internal Server Error' }));
  }
};

const updateProductPrice = (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json(new ResponseModel({ statusCode: 500, error: 'Internal Server Error' }));
  }
};

const deleteProduct = (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json(new ResponseModel({ statusCode: 500, error: 'Internal Server Error' }));
  }
};

module.exports = {
  addProduct,
  deleteProduct,
  findProduct,
  listProducts,
  updateProduct,
  updateProductPrice,
};
