const fs = require('fs');
const path = require('path');

const writeFile = (folderName, fileName, data) => {
  try {
    const filePath = path.join(__appdir, folderName, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data));
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = writeFile;
