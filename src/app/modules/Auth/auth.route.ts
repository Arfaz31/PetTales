import express from 'express';
import validateRequest from '../../Middleware/validateRequest';
import { createUserValidationSchema } from '../User/user.validation';
import { AuthController } from './auth.controller';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(createUserValidationSchema),
  AuthController.signup,
);

export const AuthRoutes = router;
