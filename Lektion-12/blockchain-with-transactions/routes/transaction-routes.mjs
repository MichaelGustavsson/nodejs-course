import express from 'express';
import { createTransaction } from '../controllers/transaction-controller.mjs';

const router = express.Router();

router.route('/transaction').post(createTransaction);

export default router;
