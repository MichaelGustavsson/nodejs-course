import express from 'express';
import {
  addTransaction,
  getTransactionPool,
  mineTransactions,
} from '../controllers/transaction-controller.mjs';

const router = express.Router();

router.route('/transaction').post(addTransaction);
router.route('/transactions').get(getTransactionPool);
router.route('/mine').get(mineTransactions);

export default router;
