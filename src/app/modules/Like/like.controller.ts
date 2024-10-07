import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LikeServices } from './like.services';

const upvotePost = catchAsync(async (req, res) => {
  const { status, _id } = req.user; // Get user status and ID from request
  const { postId } = req.params; // Extract postId from request params

  const result = await LikeServices.upvotePost(postId, _id, status); // Call service with postId

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message:
      (result.upvotes ?? 0 > 0) ? 'Successfully upvoted' : 'Upvote removed',
    data: result,
  });
});

const downvotePost = catchAsync(async (req, res) => {
  const { status, _id } = req.user;
  const { postId } = req.params;

  const result = await LikeServices.downvotePost(postId, _id, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Successfully downvoted',
    data: result,
  });
});

const getTotalUpvotes = catchAsync(async (req, res) => {
  const { postId } = req.params; // Get postId from request params
  const totalUpvotesCount = await LikeServices.getTotalUpvotesFromDB(postId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Total upvotes count fetched successfully',
    data: totalUpvotesCount,
  });
});

const getTotalDownvotes = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const totalDownvotesCount =
    await LikeServices.getTotalDownvotesFromDB(postId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Total downvotes count fetched successfully',
    data: totalDownvotesCount,
  });
});

export const LikeController = {
  upvotePost,
  downvotePost,
  getTotalUpvotes,
  getTotalDownvotes,
};
