const express = require('express');

import {
  addProduct,
  deleteProduct,
  findProduct,
  listProducts,
  updateProduct,
  updateProductPrice,
} from '../controllers/products-controller.mjs';

// Hämta router funktionen...
const router = express.Router();

router.route('/').get(listProducts).post(addProduct);

router
  .route('/:id')
  .get(findProduct)
  .put(updateProduct)
  .patch(updateProductPrice)
  .delete(deleteProduct);

export default router;
