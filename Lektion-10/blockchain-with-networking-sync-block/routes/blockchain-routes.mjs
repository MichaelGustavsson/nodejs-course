import express from 'express';
import {
  createBlock,
  getBlockchain,
  synchronizeChain,
  broadcast,
} from '../controllers/blockchain-controller.mjs';

const router = express.Router();

// Definierar url och vilken metod som anropas
// för att delegera till korrekt controller funktion...
router.route('/').get(getBlockchain);
router.route('/mine').post(createBlock);
router.route('/concensus').get(synchronizeChain);
router.route('/block/broadcast').post(broadcast);

export default router;
