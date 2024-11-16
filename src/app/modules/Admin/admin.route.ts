import { Router } from 'express';
import { USER_Role } from '../User/user.constant';
import auth from '../../Middleware/auth';
import { AdminController } from './admin.controller';

const router = Router();

router.get('/allPosts', auth(USER_Role.admin), AdminController.getAllPosts);

export const AdminRoutes = router;
