import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LikeServices } from './like.services';

// const upvotePost = catchAsync(async (req, res) => {
//   const { status, _id } = req.user; // Get user status and ID from request
//   const { postId } = req.params; // Extract postId from request params

//   const upvoteCount = await LikeServices.upvotePost(postId, _id, status); // Call service with postId

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: (upvoteCount ?? 0 > 0) ? 'Successfully upvoted' : 'Upvote removed',
//     data: { upvoteCount },
//   });
// });

// const downvotePost = catchAsync(async (req, res) => {
//   const { status, _id } = req.user;
//   const { postId } = req.params;

//   const downvoteCount = await LikeServices.downvotePost(postId, _id, status);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message:
//       (downvoteCount ?? 0 > 0) ? 'Successfully downvoted' : 'Downvote removed',
//     data: { downvoteCount },
//   });
// });

const likePost = catchAsync(async (req, res) => {
  const { status, _id } = req.user;
  const { postId } = req.params;

  const likeCount = await LikeServices.likePost(postId, _id, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Successfully liked',
    data: { likeCount },
  });
});

const dislikePost = catchAsync(async (req, res) => {
  const { status, _id } = req.user;
  const { postId } = req.params;

  const dislikeCount = await LikeServices.dislikePost(postId, _id, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Successfully disliked',
    data: { dislikeCount },
  });
});

const unLikePost = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const { postId } = req.params;

  const likeCount = await LikeServices.unLikePost(postId, _id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Like removed',
    data: { likeCount },
  });
});

const unDislikePost = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const { postId } = req.params;

  const dislikeCount = await LikeServices.unDislikePost(postId, _id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Dislike removed',
    data: { dislikeCount },
  });
});

export const LikeController = {
  likePost,
  dislikePost,
  unLikePost,
  unDislikePost,
};
