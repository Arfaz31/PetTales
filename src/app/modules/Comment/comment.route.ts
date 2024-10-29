import { Router } from 'express';
import validateRequest from '../../Middleware/validateRequest';
import { CommentValidation } from './comment.validation';
import { CommentController } from './comment.controller';
import auth from '../../Middleware/auth';
import { USER_Role } from '../User/user.constant';

const router = Router();

// Create a comment
router.post(
  '/create-comment',
  auth(USER_Role.admin, USER_Role.user),
  validateRequest(CommentValidation.createCommentZodSchema),
  CommentController.createComment,
);

// Update a comment
router.patch(
  '/update-comment/:commentId',
  auth(USER_Role.admin, USER_Role.user),
  validateRequest(CommentValidation.updateCommentZodSchema),
  CommentController.updateComment,
);

// Delete a comment by the comment author
router.delete(
  '/delete-comment/:commentId',
  auth(USER_Role.admin, USER_Role.user),
  CommentController.deleteComment,
);

// Delete a comment by the post owner
router.delete(
  '/post-owner-delete/:postId/:commentId',
  auth(USER_Role.admin, USER_Role.user),
  CommentController.deleteCommentAsPostOwner,
);

// Get comments by post ID
router.get(
  '/get-all-comment/:postId',
  auth(USER_Role.admin, USER_Role.user),
  CommentController.getComments,
);

// Get total comment count by post ID
router.get(
  '/get-total-comment/:postId',
  auth(USER_Role.admin, USER_Role.user),
  CommentController.getTotalComment,
);

export const CommentRoutes = router;
