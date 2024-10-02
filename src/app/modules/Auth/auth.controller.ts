import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.services';

const signup = catchAsync(async (req, res) => {
  const result = await AuthServices.signUpIntoDB(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const logIn = catchAsync(async (req, res) => {
  const result = await AuthServices.logInUser(req.body);
  const { accessToken, refreshToken, userData } = result;

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User logged in successfully',
    token: accessToken,
    data: userData,
  });
});

export const AuthController = {
  signup,
  logIn,
};
