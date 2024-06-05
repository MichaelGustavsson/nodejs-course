import User from '../models/UserModel.mjs';
import ErrorResponse from '../models/ErrorResponseModel.mjs';
import { hashPassword } from '../utilities/security.mjs';
import {
  save,
  findUserByEmail,
  findUserById,
  getResetPasswordToken,
  findUserByResetPasswordToken,
  updateUser,
} from '../data/fileDb.mjs';
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

// @desc    Glömt lösenord
// @route   GET /api/v1/auth/forgotpassword
// @access  PUBLIC
export const forgotPassword = async (req, res, next) => {
  const email = req.body.email;

  if (!email) {
    return next(new ErrorResponse('E-post saknas för återställning', 400));
  }

  let user = await findUserByEmail(email);

  if (!user) {
    return next(
      new ErrorResponse(
        `Ingen användare med e-post adress ${email} kunde hittas`,
        404
      )
    );
  }

  // 1. Skapa ett resetToken...
  user = await getResetPasswordToken(user.id);

  // 2. Skapa en url för reset meddelandet...
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${user.resetPasswordToken}`;

  // http://localhost:5001/api/v1/auth/resetpassword/8440c6731a1dfd2fd46851e310bbcbe80a96d609079c03e5954a454af8cb3fbb

  // 3. Skicka ett mejl för informationen för återställning...
  const message = `Använd länken för att återställa lösenordet ${resetUrl}`;

  // Returnera ett response
  res.status(200).json({ success: true, statusCode: 200, data: user });
};

// @desc    Återställ lösenord
// @route   PUT /api/v1/auth/resetpassword/:token
// @access  PUBLIC
export const resetPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    const password = req.body.password;

    if (!token || !password) {
      return next(new ErrorResponse('Token och/eller lösenord saknas.', 400));
    }

    // 1. Hämta användaren baserat på resetPasswordToken...
    const user = await findUserByResetPasswordToken(token);

    // 2. Generera en ny hash för lösenordet...
    const passwordHash = hashPassword(password);

    // 3. Uppdatera user objektet med det nya lösenordet och återställa reset??? egenskaperna till null.
    user.password = passwordHash;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpire = null;

    await updateUser(user);

    res.status(200).json({ success: true, statusCode: 200, data: user });
  } catch (error) {
    next(new ErrorResponse(error.message, 400));
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
