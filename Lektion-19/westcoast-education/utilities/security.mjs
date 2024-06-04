import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TTL,
  });
};

export const hashPassword = (password) => {
  // const salt = bcrypt.genSaltSync(10);
  // console.log(salt);
  // const hash = bcrypt.hashSync(password, 12);
  // return hash;

  return bcrypt.hashSync(password, 12);
};
