import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TTL,
  });
};

export const hashPassword = (password) => {
  return bcrypt.hashSync(password, 12);
};

export const validatePassword = async (passwordToCheck, userPassword) => {
  return await bcrypt.compare(passwordToCheck, userPassword);
};
