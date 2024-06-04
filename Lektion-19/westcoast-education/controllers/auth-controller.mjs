import User from '../models/UserModel.mjs';
import ErrorResponse from '../models/ErrorResponseModel.mjs';
import { save, findUserByEmail, findUserById } from '../data/fileDb.mjs';
import { generateToken, validatePassword } from '../utilities/security.mjs';

// @desc    Registrera en användare
// @route   POST /api/v1/auth/register
// @access  PUBLIC
export const register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Validering...
  if (!name || !email || !password) {
    return next(
      new ErrorResponse('Användarnamn, e-post eller lösenord saknas', 400)
    );
  }

  const user = new User(name, email, password, role ?? 'user');

  await save(user);

  createAndSendToken(user.id, 201, res);
};

// @desc    Logga in en användare
// @route   POST /api/v1/auth/login
// @access  PUBLIC
export const login = async (req, res, next) => {
  // 1. Validera att vi får in e-post och lösenord...
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('E-post och/eller lösenord saknas', 400));
  }
  try {
    // 2. Hämta användaren ifrån vår databas...
    const user = await findUserByEmail(email);
    // 3. Validera lösenordet.
    const isCorrect = await validatePassword(password, user.password);

    if (!isCorrect) {
      return next(new ErrorResponse('Felaktig inloggning', 401));
    }
    // 4. Generera ett nytt token och returnera det...
    return createAndSendToken(user.id, 200, res);
  } catch (error) {
    res
      .status(404)
      .json({ success: false, statusCode: 404, message: error.message });
  }
};

// @desc    Returnerar information om en inloggad användare
// @route   GET /api/v1/auth/me
// @access  PRIVATE
export const getMe = async (req, res, next) => {
  try {
    const user = await findUserById(req.user.id);
    res.status(200).json({ success: true, statusCode: 200, data: user });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, statusCode: 404, message: error.message });
  }
};

const createAndSendToken = (id, statusCode, res) => {
  // 1. Skapa ett token
  const token = generateToken(id);
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
