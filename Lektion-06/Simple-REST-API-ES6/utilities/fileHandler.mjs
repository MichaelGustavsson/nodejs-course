import fs from 'fs';
import path from 'path';

const writeFile = (folderName, fileName, data) => {
  try {
    const filePath = path.join(__appdir, folderName, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data));
  } catch (error) {
    throw new Error(error.message);
  }
};

export default writeFile;
