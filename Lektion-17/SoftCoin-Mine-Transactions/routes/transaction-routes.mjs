import express from 'express';
import {
  addTransaction,
  getTransactionPool,
} from '../controllers/transaction-controller.mjs';

const router = express.Router();

router.route('/transaction').post(addTransaction);
router.route('/transactions').get(getTransactionPool);

export default router;
