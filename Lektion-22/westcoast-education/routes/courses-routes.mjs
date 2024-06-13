import express from 'express';
import {
  addCourse,
  deleteCourse,
  getCourse,
  getCourses,
  updateCourse,
} from '../controllers/courses-controller.mjs';

import { protect, authorize } from '../middleware/authorization.mjs';

const router = express.Router();

router.post('/', protect, authorize('admin', 'manager'), addCourse);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteCourse);
router.get('/:id', getCourse);
router.get('/', getCourses);
router.put('/:id', protect, authorize('admin', 'manager'), updateCourse);

export default router;
