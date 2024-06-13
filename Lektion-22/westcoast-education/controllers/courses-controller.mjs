import { asyncHandler } from '../middleware/asyncHandler.mjs';
import ErrorResponse from '../models/ErrorResponseModel.mjs';
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
export const deleteCourse = asyncHandler(async (req, res, next) => {
  await Course.findByIdAndDelete(req.params.id);

  res.status(204).send();
});

// @desc  Sök efter en kurs
// @route GET /api/v1/courses/:id
// @access  PUBLIC
export const getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course)
    return next(
      new ErrorResponse(
        `Tyvärr hittade inte någon kurs med id: ${req.params.id}`,
        404
      )
    );

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: course,
  });
});

// @desc  Hämta alla kurser
// @route GET /api/v1/courses/
// @access  PUBLIC
export const getCourses = asyncHandler(async (req, res, next) => {
  let query;
  let queryString;
  let requestQuery = { ...req.query };
  const excludeFields = ['select', 'sort'];

  excludeFields.forEach((field) => delete requestQuery[field]);

  queryString = JSON.stringify(requestQuery).replace(
    /\b(lt|lte|gt|gte|in)\b/g,
    (match) => `$${match}`
  );

  // Skapar frågan, men kör den inte
  query = Course.find(JSON.parse(queryString));

  //SELECT(Projicering) Eventuellt addera på fälten som ska med i frågan...
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    // Addera på frågan vilka fält som ska med i resultatet...
    query = query.select(fields);
  }

  // SORT hur ska resultatet vara sorterat?
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  }

  // Kör frågan
  const courses = await query;

  res.status(200).json({
    success: true,
    statusCode: 200,
    items: courses.length,
    data: courses,
  });
});

// @desc  Uppdatera en kurs
// @route PUT /api/v1/courses/:id
// @access  PRIVATE
export const updateCourse = asyncHandler(async (req, res, next) => {
  await Course.findByIdAndUpdate(req.params.id, req.body);
  res.status(204).send();
});
