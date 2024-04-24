const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Internal Server Error';

  res.status(err.statusCode).json({ success: err.success, message: err.message });
};

module.exports = errorHandler;
