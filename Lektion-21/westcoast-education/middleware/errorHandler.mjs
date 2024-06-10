export const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    statusCode: err.statusCode || 500,
    error: err.message || 'Server Error',
  });
};
