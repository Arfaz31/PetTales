import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FollowServices } from './follow.services';

const followUser = catchAsync(async (req, res) => {
  // const { followerId, followingId } = req.body;
  const { id: followingId } = req.params; // User B (the user being followed)
  const currentUserId = req.user._id; // User A (the current logged-in user)
  const result = await FollowServices.createFollow(currentUserId, followingId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully followed the user.',
    data: result,
  });
});

const unfollowUser = catchAsync(async (req, res) => {
  const { id: followingId } = req.params;
  const currentUserId = req.user._id;
  const result = await FollowServices.unfollowUser(currentUserId, followingId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully unfollowed the user.',
    data: result,
  });
});

const getFollowers = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const result = await FollowServices.getFollowers(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully retrieved followers.',
    data: result,
  });
});

const getFollowings = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const result = await FollowServices.getFollowings(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully retrieved followings.',
    data: result,
  });
});

export const FollowController = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowings,
};
