import { Router } from 'express';
import auth from '../../Middleware/auth';
import { USER_Role } from '../User/user.constant';
import { uploadMultipleImage } from '../../utils/sendingImageToCloudinary';
import validateImageFileRequest from '../../Middleware/validateImageFileRequest';
import { ImageFilesArrayZodSchema } from './postImage.validation';
import { parseBody } from '../../Middleware/bodyParser';
import validateRequest from '../../Middleware/validateRequest';
import { createPostZodSchema, updatePostZodSchema } from './post.validation';
import { PostController } from './post.controller';

const router = Router();
router.post(
  '/create-post',
  auth(USER_Role.user, USER_Role.admin),
  uploadMultipleImage,
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(createPostZodSchema),
  PostController.createPost,
);

router.get('/', auth(USER_Role.admin), PostController.getAllPosts);
router.get(
  '/my-posts',
  auth(USER_Role.user, USER_Role.admin),
  PostController.getMyAllPosts,
);

// Route to get a single post (with premium content restriction)
router.get(
  '/:id',
  auth(USER_Role.user, USER_Role.admin),
  PostController.getSinglePost,
);

router.patch(
  '/update-post/:id',
  auth(USER_Role.user, USER_Role.admin),
  uploadMultipleImage,
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(updatePostZodSchema),
  PostController.updateMyPost,
);

router.delete(
  '/:id',
  auth(USER_Role.user, USER_Role.admin),
  PostController.deletePost,
);

export const PostRoutes = router;
