import jwt from 'jsonwebtoken';
import User from '../models/UserModel.mjs';
import { asyncHandler } from './asyncHandler.mjs';
import ErrorResponse from '../models/ErrorResponseModel.mjs';

export const protect = asyncHandler(async (req, res, next) => {
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
    next(new ErrorResponse('Behörighet saknas', 401));
  }

  // Verifiera token som vi hämtat ifrån header...
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedToken.id);

  if (!req.user) {
    next(new ErrorResponse('Behörighet saknas', 401));
  }

  next();
});

// authorize('manager','user')
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: `Rollen ${req.user.role} har inte behörighet`,
      });
    }
    next();
  };
};
