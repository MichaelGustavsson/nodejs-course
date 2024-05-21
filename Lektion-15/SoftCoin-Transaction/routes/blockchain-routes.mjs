import express from 'express';
import { listBlock } from '../controllers/blockchain-controller.mjs';

const router = express.Router();

router.route('/').get(listBlock);

export default router;
