import User from '../models/UserModel.mjs';
import ErrorResponse from '../models/ErrorResponseModel.mjs';

// @desc    Registrera en användare
// @route   POST /api/v1/auth/register
// @access  PUBLIC
export const register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({ name, email, password, role });

  createAndSendToken(user, 201, res);
};

// @desc    Logga in en användare
// @route   POST /api/v1/auth/login
// @access  PUBLIC
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('E-post och/eller lösenord saknas', 400));
  }

  // mongoose fråga
  // Vi måste hämta in användaren baserat på dess e-post...
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Felaktig inloggning', 401));
  }

  // Validering av lösenordet...
  const isCorrect = await user.validatePassword(password);

  if (!isCorrect) {
    return next(new ErrorResponse('Felaktig inloggning', 401));
  }

  createAndSendToken(user, 200, res);
};

// @desc    Returnerar information om en inloggad användare
// @route   GET /api/v1/auth/me
// @access  PRIVATE
export const getMe = async (req, res, next) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    data: 'Visa information om inloggad användare fungerar',
  });
};

// @desc    Glömt lösenord
// @route   GET /api/v1/auth/forgotpassword
// @access  PUBLIC
export const forgotPassword = async (req, res, next) => {
  res.status(200).json({
    success: true,
    statusCode: 201,
    data: 'Glömt lösenord fungerar',
  });
};

// @desc    Återställ lösenord
// @route   PUT /api/v1/auth/resetpassword/:token
// @access  PUBLIC
export const resetPassword = async (req, res, next) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    data: 'Återställning av lösenord fungerar',
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = user.generateToken();

  res.status(statusCode).json({ success: true, statusCode, token });
};
