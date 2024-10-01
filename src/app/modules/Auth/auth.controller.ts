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

export const AuthController = {
  signup,
};
