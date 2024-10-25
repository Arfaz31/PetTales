/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../Error/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';
import { JwtPayload } from 'jsonwebtoken';
import { TImageFile } from '../../Interface/image.interface';
import { sendImageToCloudinary } from '../../utils/sendingImageToCloudinary';
import mongoose from 'mongoose';

const getAllUsersFromDB = async () => {
  const result = await User.find();
  return result;
};

const getMeFromDB = async (_id: string, role: string) => {
  let result = null;
  if (role === 'user') {
    result = await User.findOne({ _id });
  }
  if (role === 'admin') {
    result = await User.findOne({ _id });
  }

  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await User.findById(id);
  return result;
};

const updateMyProfile = async (
  user: JwtPayload,
  data: Partial<TUser> = {}, // Default to empty object if no data is provided
  profilePhoto?: TImageFile, // Change to single file
  coverImg?: TImageFile, // Change to single file
) => {
  const id = user._id;
  const profile = await User.findById(id);

  if (!profile)
    throw new AppError(httpStatus.NOT_FOUND, 'User profile does not exist!');

  // Upload profilePhoto to Cloudinary if provided
  if (profilePhoto) {
    const imageName = `${profile._id}_profilePhoto`;
    const path = profilePhoto.path; // No need to access `[0]` since it's a single file
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    data.profilePhoto = secure_url as string;
  }

  // Upload coverImg to Cloudinary if provided
  if (coverImg) {
    const imageName = `${profile._id}_coverImg`;
    const path = coverImg.path; // No need to access `[0]` since it's a single file
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    data.coverImg = secure_url as string;
  }

  // If no data or files are provided, simply return the current profile
  if (Object.keys(data).length === 0) {
    return profile;
  }

  return await User.findByIdAndUpdate(id, data, { new: true });
};

const deleteUserFromDB = async (id: string) => {
  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

const updateUserRoleIntoDB = async (
  role: string,
  payload: Partial<TUser>,
  id: string,
) => {
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new Error('User not found');
  }

  if (id) {
    if (role !== 'admin') {
      throw new AppError(401, 'You have no access to update this profile');
    }
  }

  const updatedUserRole = await User.findOneAndUpdate(
    { id },
    { $set: payload },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedUserRole) {
    throw new Error('Failed to update user Role');
  }

  return updatedUserRole;
};

const createFollow = async (userId: string, followingId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (userId === followingId) {
      throw new AppError(httpStatus.BAD_REQUEST, 'You cannot follow yourself.');
    }

    const followerObjectId = new mongoose.Types.ObjectId(userId); //current user
    const followingObjectId = new mongoose.Types.ObjectId(followingId); //followed user(current user jake follow korche tar id)

    const currentUser = await User.findById(followerObjectId).session(session);
    const followingUser =
      await User.findById(followingObjectId).session(session);

    if (!currentUser || !followingUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (!currentUser?.following?.includes(followingObjectId)) {
      currentUser?.following?.push(followingObjectId);
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'You have already followed this user',
      );
    }

    if (!followingUser?.follower?.includes(followerObjectId)) {
      followingUser?.follower?.push(followerObjectId);
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You are already on this user's follower list",
      );
    }

    await currentUser.save({ session });
    await followingUser.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return {
      message: `You are now following ${followingUser.name}`,
    };
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Unfollow a user with transaction
const unFollowUser = async (userId: string, unFollowedUserId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const unFollowedUserObjectId = new mongoose.Types.ObjectId(
      unFollowedUserId,
    );

    const user = await User.findById(userObjectId).session(session);
    const unFollowedUser = await User.findById(unFollowedUserObjectId).session(
      session,
    );

    if (!user || !unFollowedUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const updateFollowingResult = await User.updateOne(
      { _id: userObjectId },
      { $pull: { following: unFollowedUserObjectId } },
      { session },
    );

    const updateFollowerResult = await User.updateOne(
      { _id: unFollowedUserObjectId },
      { $pull: { follower: userObjectId } },
      { session },
    );

    if (
      updateFollowingResult.modifiedCount === 0 ||
      updateFollowerResult.modifiedCount === 0
    ) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Unfollow action failed');
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return {
      message: `You have successfully unfollowed ${unFollowedUser.name}`,
    };
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const UserServices = {
  getAllUsersFromDB,
  getMeFromDB,
  getSingleUserFromDB,
  updateMyProfile,
  deleteUserFromDB,
  updateUserRoleIntoDB,
  createFollow,
  unFollowUser,
};
