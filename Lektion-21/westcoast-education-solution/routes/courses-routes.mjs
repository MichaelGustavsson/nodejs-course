import express from 'express';
import {
  addCourse,
  deleteCourse,
  getCourse,
  getCourses,
  updateCourse,
} from '../controllers/courses-controller.mjs';

const router = express.Router();

router.post('/', addCourse);
router.delete('/:id', deleteCourse);
router.get('/:id', getCourse);
router.get('/', getCourses);
router.put('/:id', updateCourse);

export default router;
