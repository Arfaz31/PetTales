import { Router } from 'express';
import { UnlockPostController } from './unlockPost.controller';
import auth from '../../Middleware/auth';
import { USER_Role } from '../User/user.constant';
import validateRequest from '../../Middleware/validateRequest';
import { createUnlockPremiumPostValidationSchema } from './unlockPost.validation';

const router = Router();

router.post(
  '/',
  auth(USER_Role.admin, USER_Role.user),
  validateRequest(createUnlockPremiumPostValidationSchema),
  UnlockPostController.accessUnlockPost,
);

router.get(
  '/',
  auth(USER_Role.user, USER_Role.admin),
  UnlockPostController.getUnlockedPosts,
);

export const UnlockPostRoutes = router;
