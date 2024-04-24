const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const products = require('../data/products.json');
const ResponseModel = require('../utilities/ResponseModel');
const ErrorResponse = require('../utilities/ErrorResponseModel');

const listProducts = (req, res, next) => {
  try {
    res.status(200).json(new ResponseModel({ statusCode: 200, data: products }));
  } catch (error) {
    res.status(500).json(new ResponseModel({ statusCode: 500, error: 'Internal Server Error' }));
  }
};

const findProduct = (req, res, next) => {
  try {
    const id = req.params.id;
    const product = products.find((p) => p.id === id);

    if (!product) {
      return next(new ErrorResponse(`Kunde inte hitta någon produkt med id ${id}`, 404));
    }

    res.status(200).json(new ResponseModel({ statusCode: 200, data: product }));
  } catch (error) {
    next(new ErrorResponse('Det gick galet', 400));
  }
};

const addProduct = (req, res) => {
  const filePath = path.join(__appdir, 'data', 'products.json');

  try {
    const id = uuid.v4().replaceAll('-', '');
    req.body.id = id;
    products.push(req.body);

    fs.writeFileSync(filePath, JSON.stringify(products));

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