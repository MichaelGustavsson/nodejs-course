const express = require('express');
const {
  addCustomer,
  deleteCustomer,
  listCustomers,
  findCustomer,
  updateCustomer,
  updateCustomerActive,
} = require('../controllers/customers-controller');

const router = express.Router();

router.route('/').get(listCustomers).post(addCustomer);

router
  .route('/:id')
  .get(findCustomer)
  .put(updateCustomer)
  .patch(updateCustomerActive)
  .delete(deleteCustomer);

module.exports = router;
