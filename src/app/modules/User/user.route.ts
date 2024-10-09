import { Router } from 'express';
import auth from '../../Middleware/auth';
import { USER_Role } from './user.constant';
import { UserController } from './user.controller';
import validateRequest from '../../Middleware/validateRequest';
import { updateUserValidationSchema } from './user.validation';
import { parseBody } from '../../Middleware/bodyParser';
import {
  // upload,
  uploadSingleImage,
} from '../../utils/sendingImageToCloudinary';

const router = Router();

router.get('/', auth(USER_Role.admin), UserController.getAllUsers);
router.get('/me', auth(USER_Role.admin, USER_Role.user), UserController.getMe);

router.get('/:id', auth(USER_Role.admin), UserController.getSingleUser);

router.patch(
  '/update-profile',
  auth(USER_Role.admin, USER_Role.user),
  // upload.single('profilePhoto'),
  uploadSingleImage,
  parseBody,
  validateRequest(updateUserValidationSchema),
  UserController.updateMyProfile,
);
router.patch('/:id/role', auth(USER_Role.admin), UserController.updateUserRole);

router.delete('/:id', auth(USER_Role.admin), UserController.deleteUser);

export const UserRoutes = router;
