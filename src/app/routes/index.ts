import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
import { FollowRoutes } from '../modules/Follow/follow.route';
import { PostRoutes } from '../modules/Post/post.route';
import { LikeRoutes } from '../modules/Like/like.route';
import { CommentRoutes } from '../modules/Comment/comment.route';
import { paymentRoutes } from '../modules/payment/payment.route';
import { UnlockPostRoutes } from '../modules/UnlockPost/unlockPost.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/action',
    route: FollowRoutes,
  },
  {
    path: '/post',
    route: PostRoutes,
  },
  {
    path: '/like',
    route: LikeRoutes,
  },
  {
    path: '/comment',
    route: CommentRoutes,
  },
  {
    path: '/payment',
    route: paymentRoutes,
  },
  {
    path: '/unlockPost',
    route: UnlockPostRoutes,
  },
];

// Use the main `router.use` to register each route
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
