import httpStatus from 'http-status';
import AppError from '../../Error/AppError';
import Comment from './comment.model';
import { TComment } from './comment.inteface';
import { Post } from '../Post/post.model';

const createCommentIntoDB = async (payload: TComment) => {
  const result = await Comment.create(payload);
  // Add the comment ID to the comments array in the Post document
  await Post.findByIdAndUpdate(payload.post, {
    $addToSet: { comments: result._id }, // Use result._id here
  });
  return result;
};

const updateCommentInDB = async (
  commentId: string,
  userId: string,
  content: string,
) => {
  const comment = await Comment.findOne({ _id: commentId, user: userId });
  if (!comment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Comment not found or unauthorized access',
    );
  }

  comment.content = content;
  await comment.save();
  return comment;
};

//delete comment as a commenter in other post
const deleteCommentInDB = async (commentId: string, userId: string) => {
  const comment = await Comment.findOne({ _id: commentId, user: userId });
  if (!comment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Comment not found or unauthorized access',
    );
  }
  await Post.findByIdAndUpdate(comment.post, {
    $pull: { comments: comment._id },
  });

  await Comment.deleteOne({ _id: commentId });
  return { success: true };
};

const deleteCommentAsPostOwner = async (
  commentId: string,
  postId: string,
  ownerId: string,
) => {
  const post = await Post.findOne({ _id: postId, user: ownerId });
  if (!post) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not the owner of this post',
    );
  }
  await Post.findByIdAndUpdate(post._id, {
    $pull: { comments: commentId },
  });

  await Comment.deleteOne({ _id: commentId, post: postId });
  return { success: true };
};

// const getCommentsByPostId = async (postId: string) => {
//   const comments = await Comment.find({ post: postId })
//     .populate('user', 'name profilePhoto')
//     .populate('post', 'title user');
//   return comments;
// };
const getCommentsByPostId = async (postId: string) => {
  const comments = await Comment.find({ post: postId })
    .populate('user', 'name profilePhoto username')
    .populate({
      path: 'post',
      select: 'title user',
      populate: { path: 'user', select: '_id' },
    });
  return comments;
};

const getTotalCommentsByPostId = async (postId: string) => {
  const totalComments = await Comment.countDocuments({ post: postId });
  return totalComments;
};

export const CommentServices = {
  createCommentIntoDB,
  updateCommentInDB,
  deleteCommentInDB,
  deleteCommentAsPostOwner,
  getCommentsByPostId,
  getTotalCommentsByPostId,
};
