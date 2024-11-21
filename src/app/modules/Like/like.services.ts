// services
import httpStatus from 'http-status';
import AppError from '../../Error/AppError';
import { Post } from '../Post/post.model';
import { Types } from 'mongoose';

// Like a post
export const likePost = async (
  postId: string,
  userId: string,
  status: 'basic' | 'premium',
) => {
  const post = await Post.findById(postId);
  if (!post) throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  const userObjectId = new Types.ObjectId(userId);
  const isUnlocked = post.isUnlockedBy?.includes(userObjectId);

  if (post.contentType === 'premium' && status === 'basic' && !isUnlocked) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Basic users cannot like premium content',
    );
  }

  // Add like, remove dislike if present
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { $addToSet: { like: userObjectId }, $pull: { disLike: userObjectId } },
    { new: true },
  );

  if (!updatedPost) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }
  return updatedPost.like.length;
};

// Dislike a post
export const dislikePost = async (
  postId: string,
  userId: string,
  status: 'basic' | 'premium',
) => {
  const post = await Post.findById(postId);
  if (!post) throw new AppError(httpStatus.NOT_FOUND, 'Post not found');

  const userObjectId = new Types.ObjectId(userId);
  const isUnlocked = post.isUnlockedBy?.includes(userObjectId);
  if (post.contentType === 'premium' && status === 'basic' && !isUnlocked) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Basic users cannot dislike premium content',
    );
  }

  // Add dislike, remove like if present
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { $addToSet: { disLike: userObjectId }, $pull: { like: userObjectId } },
    { new: true },
  );

  if (!updatedPost) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }
  return updatedPost.disLike.length;
};

// Unlike a post
export const unLikePost = async (postId: string, userId: string) => {
  const userObjectId = new Types.ObjectId(userId);
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { $pull: { like: userObjectId } },
    { new: true },
  );

  if (!updatedPost) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }
  return updatedPost.like.length;
};

// Undislike a post
export const unDislikePost = async (postId: string, userId: string) => {
  const userObjectId = new Types.ObjectId(userId);
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { $pull: { disLike: userObjectId } },
    { new: true },
  );

  if (!updatedPost) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }
  return updatedPost.disLike.length;
};

export const LikeServices = {
  likePost,
  dislikePost,
  unLikePost,
  unDislikePost,
};
