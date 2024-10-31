import { Router } from 'express';
import auth from '../../Middleware/auth';
import { USER_Role } from '../User/user.constant';
import { LikeController } from './like.controller';

const router = Router();

router.patch(
  '/like/:postId',
  auth(USER_Role.user, USER_Role.admin),
  LikeController.likePost,
);
router.patch(
  '/unlike/:postId',
  auth(USER_Role.user, USER_Role.admin),
  LikeController.unLikePost,
);
router.patch(
  '/dislike/:postId',
  auth(USER_Role.user, USER_Role.admin),
  LikeController.dislikePost,
);
router.patch(
  '/undislike/:postId',
  auth(USER_Role.user, USER_Role.admin),
  LikeController.unDislikePost,
);
export const LikeRoutes = router;
