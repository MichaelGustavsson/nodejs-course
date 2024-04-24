const logger = (req, res, next) => {
  // req.user = 'Michael';
  // req.role = 'Sales';
  const message = `${req.method} ${req.originalUrl} - ${new Date().toLocaleDateString(
    'sv-SE'
  )} ${new Date().toLocaleTimeString('sv-SE')}`;
  console.log(message);

  next();
};

module.exports = logger;
