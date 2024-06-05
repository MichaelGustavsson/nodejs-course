import express from 'express';
import { protect } from '../middleware/authorization.mjs';
import {
  addCourse,
  deleteCourse,
  getCourse,
  getCourses,
  updateCourse,
} from '../controllers/courses-controller.mjs';

const router = express.Router();

router.post('/', protect, addCourse);
router.delete('/:id', protect, deleteCourse);
router.get('/:id', getCourse);
router.get('/', getCourses);
router.put('/:id', protect, updateCourse);

export default router;
