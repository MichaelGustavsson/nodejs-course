const uuid = require('uuid');
const products = require('../data/products.json');
const ResponseModel = require('../utilities/ResponseModel');
const ErrorResponse = require('../utilities/ErrorResponseModel');
const fileHandler = require('../utilities/fileHandler');

const listProducts = (req, res, next) => {
  res.status(200).json(new ResponseModel({ statusCode: 200, data: products }));
};

const findProduct = (req, res, next) => {
  const product = getProduct(req, res, next);

  if (product) {
    res.status(200).json(new ResponseModel({ statusCode: 200, data: product }));
  }
};

const addProduct = (req, res, next) => {
  const id = uuid.v4().replaceAll('-', '');
  req.body.id = id;
  products.push(req.body);

  fileHandler('data', 'products.json', products);

  res.status(201).json(new ResponseModel({ statusCode: 201, data: req.body }));
};

const updateProduct = (req, res, next) => {
  const product = getProduct(req, res, next);

  if (product) {
    product.name = req.body.name ?? product.name;
    product.price = req.body.price ?? product.price;
    product.weight = req.body.weight ?? product.weight;

    fileHandler('data', 'products.json', products);

    res.status(204).end();
  }
};

const updateProductPrice = (req, res, next) => {
  const product = getProduct(req, res, next);

  if (product) {
    product.price = req.body.price ?? product.price;

    fileHandler('data', 'products.json', products);

    res.status(204).end();
  }
};

const deleteProduct = (req, res, next) => {
  const product = getProduct(req, res, next);

  if (product) {
    products.splice(products.indexOf(product), 1);

    fileHandler('data', 'products.json', products);
    res.status(204).end();
  }
};

const getProduct = (req, res, next) => {
  const product = products.find((c) => c.id === req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(
        `Kunde inte hitta någon produkt med id: ${req.params.id}`
      )
    );
  }

  return product;
};

module.exports = {
  addProduct,
  deleteProduct,
  findProduct,
  listProducts,
  updateProduct,
  updateProductPrice,
};
