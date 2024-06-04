import jwt from 'jsonwebtoken';
import { readFileAsync } from '../utilities/fileHandler.mjs';

export const protect = async (req, res, next) => {
  let token;

  // Verifiera att request header innehåller authorization nyckel och att
  // den börjar med Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, statusCode: 401, message: 'Behörighet saknas.' });
  }

  // Verifiera token som vi hämtat ifrån header...
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const users = await readFileAsync('data', 'users.json');

    // Placera funnen användare i request objektet som en egenskap user
    req.user = users.find((u) => u.id === decodedToken.id);
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, statusCode: 401, message: error.message });
  }

  next();
};
