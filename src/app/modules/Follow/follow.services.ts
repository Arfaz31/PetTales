import { User } from '../User/user.model';
import { Follow } from './follow.model';

const createFollow = async (currentUserId: string, followingId: string) => {
  // Ensure users are valid
  const follower = await User.findById(currentUserId);
  const following = await User.findById(followingId);
  if (!follower || !following) throw new Error('User not found');

  // Check if the follow relation already exists
  const followExists = await Follow.findOne({
    follower: currentUserId,
    following: followingId,
  });
  if (followExists) throw new Error('You are already following this user.');

  // Create follow relation
  const follow = await Follow.create({
    follower: currentUserId,
    following: followingId,
  });
  return follow;
};

const unfollowUser = async (followerId: string, followingId: string) => {
  // Remove follow relation
  const unfollow = await Follow.findOneAndDelete({
    follower: followerId,
    following: followingId,
  });
  if (!unfollow) throw new Error('Follow relation does not exist');
  return unfollow;
};

const getFollowers = async (userId: string) => {
  const followers = await Follow.find({ following: userId }) //The query is trying to find all users who follow a specific userId.
    .populate('follower', '-password') // Populate user info, exclude password
    .lean();
  const totalFollowers = followers.length;
  return { followers, totalFollowers };
};

const getFollowings = async (userId: string) => {
  const followings = await Follow.find({ follower: userId }) //The result will be a list of users that this userId is currently following.
    .populate('following', '-password') // Populate user info, exclude password
    .lean();
  const totalFollowings = followings.length;
  return { followings, totalFollowings };
};

export const FollowServices = {
  createFollow,
  unfollowUser,
  getFollowers,
  getFollowings,
};
