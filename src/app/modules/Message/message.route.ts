import { Router } from 'express';
import auth from '../../Middleware/auth';
import { USER_Role } from '../User/user.constant';
import MessageController from './message.controller';

const router = Router();

router.post(
  '/addMessage',
  auth(USER_Role.user, USER_Role.admin),
  MessageController.addMessage,
);

router.get(
  '/getMessages/:chatId',
  auth(USER_Role.user, USER_Role.admin),
  MessageController.getMessages,
);

export const MessageRoutes = router;
