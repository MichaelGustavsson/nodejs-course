import User from '../models/UserModel.mjs';
import { save } from '../data/fileDb.mjs';
import { generateToken } from '../utilities/security.mjs';

// @desc    Registrera en användare
// @route   POST /api/v1/auth/register
// @access  PUBLIC
export const register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Validering...
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Användarnamn, e-post eller lösenord saknas',
    });
  }

  const user = new User(name, email, password, role ?? 'user');

  await save(user);

  createAndSendToken(user.id, 201, res);
};

// @desc    Logga in en användare
// @route   POST /api/v1/auth/login
// @access  PUBLIC
export const login = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, statusCode: 200, message: 'login funkar!' });
};

// @desc    Returnerar information om en inloggad användare
// @route   GET /api/v1/auth/me
// @access  PUBLIC
export const getMe = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, statusCode: 200, message: 'getMe funkar!' });
};

const createAndSendToken = (id, statusCode, res) => {
  // 1. Skapa ett token
  const token = generateToken(id);
  console.log(token);
  // 2. Sätt ihop lite options
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_TTL * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  // 3. Skicka tillbaka token till användaren
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, statusCode, token });
};
