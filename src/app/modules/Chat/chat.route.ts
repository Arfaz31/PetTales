import { Router } from 'express';
import auth from '../../Middleware/auth';
import { USER_Role } from '../User/user.constant';
import { ChatController } from './chat.controller';

const router = Router();

// router.post(
//   '/createChat',
//   auth(USER_Role.user, USER_Role.admin),
//   ChatController.createChat,
// );

router.get(
  '/userChats/:id',
  auth(USER_Role.user, USER_Role.admin),
  ChatController.getUserChats,
);
router.get(
  '/findSpecificChat/:userId1/:userId2',
  auth(USER_Role.user, USER_Role.admin),
  ChatController.getUserChats,
);

export const ChatRoutes = router;
