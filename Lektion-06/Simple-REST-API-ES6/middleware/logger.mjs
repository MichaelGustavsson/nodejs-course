import fs from 'fs';
import path from 'path';

const logger = (req, res, next) => {
  const filePath = path.join(__appdir, 'logs', 'app.log');

  const message = `${req.method} ${
    req.originalUrl
  } - ${new Date().toLocaleDateString('sv-SE')} ${new Date().toLocaleTimeString(
    'sv-SE'
  )}\n`;

  fs.appendFileSync(filePath, message);

  next();
};

export default logger;
