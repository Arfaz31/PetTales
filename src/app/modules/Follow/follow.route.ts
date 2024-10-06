import express from 'express';
import { FollowController } from './follow.controller';
// import validateRequest from '../../Middleware/validateRequest';
// import { followValidationSchema } from './follow.validation';
import { USER_Role } from '../User/user.constant';
import auth from '../../Middleware/auth';

const router = express.Router();

// Follow and unfollow routes
router.post(
  '/follow/:id',
  // validateRequest(followValidationSchema),
  auth(USER_Role.admin, USER_Role.user),
  FollowController.followUser,
);
router.delete(
  '/unfollow/:id',
  auth(USER_Role.admin, USER_Role.user),
  FollowController.unfollowUser,
);

// Get followers and followings
router.get(
  '/followers',
  auth(USER_Role.admin, USER_Role.user),
  FollowController.getFollowers,
);
router.get(
  '/followings',
  auth(USER_Role.admin, USER_Role.user),
  FollowController.getFollowings,
);

export const FollowRoutes = router;
