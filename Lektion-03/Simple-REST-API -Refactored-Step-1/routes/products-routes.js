const express = require('express');
const uuid = require('uuid');
const products = require('../model/Products');
const ResponseModel = require('../model/ResponseModel');

// Hämta router funktionen...
const router = express.Router();

router
  .route('/')
  .get((req, res) => {
    res.status(200).json(new ResponseModel({ statusCode: 200, data: products }));
  })
  .post((req, res) => {
    const id = uuid.v4().replaceAll('-', '');
    req.body.id = id;
    products.push(req.body);

    res.status(201).json(new ResponseModel({ statusCode: 201, data: req.body }));
  });

router
  .route('/:id')
  .get((req, res) => {
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
  })
  .put((req, res) => {
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
  })
  .patch((req, res) => {
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

    product.price = req.body.price ?? product.price;

    res.status(204).end();
  })
  .delete((req, res) => {
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
  });

module.exports = router;
