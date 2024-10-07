import httpStatus from 'http-status';
import AppError from '../../Error/AppError';
import { Post } from '../Post/post.model';
import { USER_STATUS } from '../User/user.constant';
import Like from './like.model';

const upvotePost = async (
  postId: string,
  userId: string,
  status: 'basic' | 'premium',
) => {
  // Check if the post exists
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  // Prevent basic users from voting on premium content
  if (post.contentType === 'premium' && status === USER_STATUS.basic) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Basic users cannot vote on premium content',
    );
  }

  // Check if the user already liked or downvoted the post
  let likeRecord = await Like.findOne({ user: userId, post: postId });

  if (likeRecord) {
    // If the user had already upvoted, remove the upvote (toggle behavior)
    if (likeRecord.upvotes ?? 0 > 0) {
      //?? 0 (Nullish Coalescing Operator): This ensures that if likeRecord.upvotes is undefined or null, it defaults to 0
      likeRecord.upvotes = (likeRecord.upvotes ?? 0) - 1;
    } else {
      // Add the upvote
      likeRecord.upvotes = (likeRecord.upvotes ?? 0) + 1;
    }

    // If the user had already downvoted, remove the downvote
    if ((likeRecord.downvotes ?? 0) > 0) {
      likeRecord.downvotes = (likeRecord.downvotes ?? 0) - 1;
    }
  } else {
    // Create a new like record if the user has not liked or downvoted the post before
    likeRecord = await Like.create({
      user: userId,
      post: postId,
      upvotes: 1, // Start with 1 upvote
      downvotes: 0, // No downvotes initially
    });
  }

  // Save the like record after modifications
  await likeRecord.save();
  return likeRecord;
};

const downvotePost = async (
  postId: string,
  userId: string,
  status: 'basic' | 'premium',
) => {
  // Check if the post exists
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  // Prevent basic users from voting on premium content
  if (post.contentType === 'premium' && status === USER_STATUS.basic) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Basic users cannot vote on premium content',
    );
  }

  // Check if the user already voted on the post
  let likeRecord = await Like.findOne({ user: userId, post: postId });

  if (likeRecord) {
    // Ensure upvotes and downvotes are never undefined
    likeRecord.upvotes = likeRecord.upvotes ?? 0;
    likeRecord.downvotes = likeRecord.downvotes ?? 0;

    // If the user had already upvoted, remove the upvote
    if (likeRecord.upvotes > 0) {
      likeRecord.upvotes -= 1;
    }

    // If the user already downvoted, reverse the downvote (toggle behavior)
    if (likeRecord.downvotes > 0) {
      likeRecord.downvotes -= 1;
    } else {
      // Otherwise, add the downvote
      likeRecord.downvotes += 1;
    }
  } else {
    // Create a new like record with the downvote, initialize upvotes and downvotes
    likeRecord = new Like({
      user: userId,
      post: postId,
      upvotes: 0, // Initialize upvotes to 0
      downvotes: 1, // Initialize downvotes to 1
    });
  }

  await likeRecord.save();
  return likeRecord;
};

// Count total upvotes using find and reduce
const getTotalUpvotesFromDB = async (postId: string) => {
  const likes = await Like.find({ post: postId }); // Fetch all likes for the post

  if (!likes.length) {
    return 0; // Return 0 if no likes found
  }

  // Use reduce to sum up the upvotes
  const totalUpvotes = likes.reduce(
    (total, like) => total + (like.upvotes || 0),
    0,
  );
  return totalUpvotes;
};

const getTotalDownvotesFromDB = async (postId: string) => {
  const likes = await Like.find({ post: postId }); // Fetch all likes for the post

  if (!likes.length) {
    return 0; // Return 0 if no likes found
  }

  const totalDownvotes = likes.reduce(
    (total, like) => total + (like.downvotes || 0),
    0,
  );
  return totalDownvotes;
};

export const LikeServices = {
  upvotePost,
  downvotePost,
  getTotalUpvotesFromDB,
  getTotalDownvotesFromDB,
};
