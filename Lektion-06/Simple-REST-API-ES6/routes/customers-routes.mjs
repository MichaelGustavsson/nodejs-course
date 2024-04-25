import express from 'express';

import {
  addCustomer,
  deleteCustomer,
  listCustomers,
  findCustomer,
  updateCustomer,
  updateCustomerActive,
} from '../controllers/customers-controller.mjs';

const router = express.Router();

router.route('/').get(listCustomers).post(addCustomer);

router
  .route('/:id')
  .get(findCustomer)
  .put(updateCustomer)
  .patch(updateCustomerActive)
  .delete(deleteCustomer);

export default router;
