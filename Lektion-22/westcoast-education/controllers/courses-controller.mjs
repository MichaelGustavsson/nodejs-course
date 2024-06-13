import { asyncHandler } from '../middleware/asyncHandler.mjs';
import Course from '../models/CourseModel.mjs';

// @desc  Lägga till en ny kurs
// @route POST /api/v1/courses
// @access  PRIVATE
export const addCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.create(req.body);

  res.status(201).json({ success: true, statusCode: 201, data: course });
});

// @desc  Ta bort en kurs
// @route DELETE /api/v1/courses/:id
// @access  PRIVATE
export const deleteCourse = (req, res, next) => {
  res.status(200).json({
    success: true,
    statusCode: 204,
    message: `deleteCourse funkar för id: ${req.params.id}`,
  });
};

// @desc  Sök efter en kurs
// @route GET /api/v1/courses/:id
// @access  PUBLIC
export const getCourse = (req, res, next) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: `getCourse funkar för id: ${req.params.id}`,
  });
};

// @desc  Hämta alla kurser
// @route GET /api/v1/courses/
// @access  PUBLIC
export const getCourses = (req, res, next) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'getCourses funkar',
  });
};

// @desc  Uppdatera en kurs
// @route PUT /api/v1/courses/:id
// @access  PRIVATE
export const updateCourse = (req, res, next) => {
  res.status(200).json({
    success: true,
    statusCode: 204,
    message: 'updateCourse funkar',
  });
};
