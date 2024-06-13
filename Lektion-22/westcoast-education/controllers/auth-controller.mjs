import User from '../models/UserModel.mjs';
import ErrorResponse from '../models/ErrorResponseModel.mjs';
import { asyncHandler } from '../middleware/asyncHandler.mjs';

// @desc    Registrera en användare
// @route   POST /api/v1/auth/register
// @access  PUBLIC
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({ name, email, password, role });

  createAndSendToken(user, 201, res);
});

// @desc    Logga in en användare
// @route   POST /api/v1/auth/login
// @access  PUBLIC
export const login = asyncHandler(async (req, res, next) => {
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
});

// @desc    Returnerar information om en inloggad användare
// @route   GET /api/v1/auth/me
// @access  PRIVATE
export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('course');
  res.status(200).json({
    success: true,
    statusCode: 200,
    data: user,
  });
});

// @desc    Uppdatera användar informationen
// @route   GET /api/v1/auth/updateuser
// @access  PRIVATE
export const updateUserDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, statusCode: 200, data: user });
});

// @desc    Uppdatera lösenord
// @route   GET /api/v1/auth/updatepassword
// @access  PRIVATE
export const updatePassword = asyncHandler(async (req, res, next) => {
  // Uppgift lägg till validering att aktuellt samt nytt lösenord finns med...

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.validatePassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Felaktigt lösenord', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  createAndSendToken(user, 200, res);
});

// @desc    Glömt lösenord
// @route   GET /api/v1/auth/forgotpassword
// @access  PUBLIC
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const email = req.body.email;

  if (!email) {
    return next(new ErrorResponse('E-post för återställning saknas', 400));
  }

  let user = await User.findOne({ email });

  if (!user)
    return next(
      new ErrorResponse(`Ingen användare med e-post ${email} kunde hittas`, 400)
    );

  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Skapa en reset URL...
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  res.status(200).json({
    success: true,
    statusCode: 201,
    data: { token: resetToken, url: resetUrl },
  });
});

// @desc    Återställ lösenord
// @route   PUT /api/v1/auth/resetpassword/:token
// @access  PUBLIC
export const resetPassword = asyncHandler(async (req, res, next) => {
  const password = req.body.password;
  const token = req.params.token;

  if (!password) return next(new ErrorResponse('Lösenord saknas,400'));

  let user = await User.findOne({ resetPasswordToken: token });

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;

  await user.save();

  createAndSendToken(user, 200, res);
});

const createAndSendToken = (user, statusCode, res) => {
  const token = user.generateToken();

  res.status(statusCode).json({ success: true, statusCode, token });
};
