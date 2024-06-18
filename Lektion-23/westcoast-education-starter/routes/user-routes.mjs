import express from 'express';
import {
  createUser,
  deleteUser,
  getUsers,
  getUser,
  updateUser,
} from '../controllers/user-controller.mjs';

import { protect, authorize } from '../middleware/authorization.mjs';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUser).delete(deleteUser).put(updateUser);

export default router;
