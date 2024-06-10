// @desc    Registrera en användare
// @route   POST /api/v1/auth/register
// @access  PUBLIC
export const register = async (req, res, next) => {
  res.status(201).json({
    success: true,
    statusCode: 201,
    data: 'Registrera användare fungerar',
  });
};

// @desc    Logga in en användare
// @route   POST /api/v1/auth/login
// @access  PUBLIC
export const login = async (req, res, next) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    data: 'Inloggning av användare fungerar',
  });
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

const createAndSendToken = (id, statusCode, res) => {};
