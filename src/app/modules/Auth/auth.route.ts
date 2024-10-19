import express from 'express';
import validateRequest, {
  validateRequestCookies,
} from '../../Middleware/validateRequest';
import { createUserValidationSchema } from '../User/user.validation';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { USER_Role } from '../User/user.constant';
import auth from '../../Middleware/auth';

const router = express.Router();

router.post(
  '/register',
  validateRequest(createUserValidationSchema),
  AuthController.signup,
);
router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.logIn,
);

router.post(
  '/change-password',
  auth(USER_Role.user, USER_Role.admin),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword,
);

router.post(
  '/refresh-token',
  validateRequestCookies(AuthValidation.refreshTokenValidationSchema),
  AuthController.refreshToken,
);

router.post(
  '/forget-password',
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthController.forgetPassword,
);

router.post(
  '/reset-password',
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthController.resetPassword,
);
export const AuthRoutes = router;
