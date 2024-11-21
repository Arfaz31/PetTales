import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
import { PostRoutes } from '../modules/Post/post.route';
import { LikeRoutes } from '../modules/Like/like.route';
import { CommentRoutes } from '../modules/Comment/comment.route';
import { paymentRoutes } from '../modules/payment/payment.route';
import { UnlockPostRoutes } from '../modules/UnlockPost/unlockPost.route';
import { StatusUpgradeRoutes } from '../modules/Status-Upgrade/statusUpgrade.route';
import { AdminRoutes } from '../modules/Admin/admin.route';
import { ChatRoutes } from '../modules/Chat/chat.route';
import { MessageRoutes } from '../modules/Message/message.route';

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
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/posts',
    route: PostRoutes,
  },
  {
    path: '/postAction',
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
  {
    path: '/statusUpgrade',
    route: StatusUpgradeRoutes,
  },
  {
    path: '/chat',
    route: ChatRoutes,
  },
  {
    path: '/message',
    route: MessageRoutes,
  },
];

// Use the main `router.use` to register each route
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
