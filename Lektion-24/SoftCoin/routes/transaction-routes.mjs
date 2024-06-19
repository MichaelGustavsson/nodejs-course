import express from 'express';
import {
  addTransaction,
  getTransactionPool,
  getWalletBalance,
  mineTransactions,
} from '../controllers/transaction-controller.mjs';

const router = express.Router();

router.route('/transaction').post(addTransaction);
router.route('/transactions').get(getTransactionPool);
router.route('/mine').get(mineTransactions);
router.route('/info').get(getWalletBalance);

export default router;
