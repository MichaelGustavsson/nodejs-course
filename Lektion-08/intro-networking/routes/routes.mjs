import express from 'express';
import { getData } from '../controllers/controller.mjs';

const router = express.Router();

router.route('/').get(getData);

export default router;
