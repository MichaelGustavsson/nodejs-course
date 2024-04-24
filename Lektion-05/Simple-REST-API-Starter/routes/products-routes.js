const express = require('express');

const {
  addProduct,
  deleteProduct,
  findProduct,
  listProducts,
  updateProduct,
  updateProductPrice,
} = require('../controllers/products-controller');

// Hämta router funktionen...
const router = express.Router();

router.route('/').get(listProducts).post(addProduct);

router
  .route('/:id')
  .get(findProduct)
  .put(updateProduct)
  .patch(updateProductPrice)
  .delete(deleteProduct);

module.exports = router;
