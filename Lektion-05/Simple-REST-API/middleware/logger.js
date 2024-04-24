const fs = require('fs');
const path = require('path');

const logger = (req, res, next) => {
  const filePath = path.join(__appdir, 'logs', 'app.log');

  const message = `${req.method} ${req.originalUrl} - ${new Date().toLocaleDateString(
    'sv-SE'
  )} ${new Date().toLocaleTimeString('sv-SE')}\n`;

  fs.appendFileSync(filePath, message);

  next();
};

module.exports = logger;
