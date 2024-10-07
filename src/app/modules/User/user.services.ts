/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../Error/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';
import { JwtPayload } from 'jsonwebtoken';
import { TImageFile } from '../../Interface/image.interface';
import { sendImageToCloudinary } from '../../utils/sendingImageToCloudinary';

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

// const CreateFollowUser = async (
//   followedUserId: string,
//   currentUserId: string,
// ) => {
//   const session = await mongoose.startSession(); // Start a session
//   session.startTransaction(); // Start transaction

//   try {
//     const followedUserObjectId = new Types.ObjectId(followedUserId);
//     const currentUserObjectId = new Types.ObjectId(currentUserId);

//     // Find user A (currentUser) and user B (followedUser) in the same session
//     const currentUser =
//       await User.findById(currentUserObjectId).session(session);
//     if (!currentUser) throw new Error('Current user not found');

//     const followedUser =
//       await User.findById(followedUserObjectId).session(session);
//     if (!followedUser) throw new Error('User to be followed not found');

//     // Prevent duplicate follow
//     if (
//       currentUser.following?.includes(followedUserObjectId) ||
//       followedUser.followers?.includes(currentUserObjectId)
//     ) {
//       throw new AppError(
//         httpStatus.BAD_REQUEST,
//         'You already follow this user',
//       );
//     }

//     // Initialize following and followers arrays if undefined
//     if (!currentUser.following) currentUser.following = [];
//     if (!followedUser.followers) followedUser.followers = [];

//     // Update the following/follower arrays
//     currentUser.following.push(followedUserObjectId);
//     followedUser.followers.push(currentUserObjectId);

//     // Save both users in the transaction
//     const result = await currentUser.save({ session });
//     await followedUser.save({ session });

//     // Commit the transaction if all operations succeed
//     await session.commitTransaction();
//     session.endSession(); // End session

//     return result;
//   } catch (error: any) {
//     // If any error occurs, abort the transaction and rollback
//     await session.abortTransaction();
//     session.endSession();

//     throw new AppError(httpStatus.BAD_REQUEST, error.message);
//   }
// };

// const RemoveFollowUser = async (
//   unfollowedUserId: string,
//   currentUserId: string,
// ) => {
//   const session = await mongoose.startSession(); // Start a session
//   session.startTransaction(); // Start transaction

//   try {
//     const unfollowedUserObjectId = new Types.ObjectId(unfollowedUserId);
//     const currentUserObjectId = new Types.ObjectId(currentUserId);

//     // Find user A (currentUser) and user B (unfollowedUser) in the same session
//     const currentUser =
//       await User.findById(currentUserObjectId).session(session);
//     if (!currentUser) throw new Error('Current user not found');

//     const unfollowedUser = await User.findById(unfollowedUserObjectId).session(
//       session,
//     );
//     if (!unfollowedUser) throw new Error('User to be unfollowed not found');

//     // Prevent unfollowing if the user is not followed
//     if (
//       !currentUser.following?.includes(unfollowedUserObjectId) ||
//       !unfollowedUser.followers?.includes(currentUserObjectId)
//     ) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'You do not follow this user');
//     }

//     // Use updateOne with $pull to remove the user from following and followers lists
//     const result = await User.updateOne(
//       { _id: currentUserObjectId },
//       { $pull: { following: unfollowedUserObjectId } },
//       { session },
//     );

//     await User.updateOne(
//       { _id: unfollowedUserObjectId },
//       { $pull: { followers: currentUserObjectId } },
//       { session },
//     );

//     // Commit the transaction if all operations succeed
//     await session.commitTransaction();
//     session.endSession(); // End session
//     return result;
//     // return { message: 'Successfully unfollowed the user' };
//   } catch (error: any) {
//     // If any error occurs, abort the transaction and rollback
//     await session.abortTransaction();
//     session.endSession();

//     throw new AppError(httpStatus.BAD_REQUEST, error.message);
//   }
// };

// const getUserFollowings = async (currentUserId: string) => {
//   const user = await User.findById(currentUserId)
//     .populate('following')
//     .select('following')
//     .lean(); // .lean(): Returns a plain JavaScript object for better performance and lower memory overhead.
//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'user not found');
//   }
//   const followingCount = user?.following?.length ?? 0; // Count of following users

//   return { followings: user?.following, followingCount };
// };

// const getUserFollowers = async (userId: string) => {
//   const user = await User.findById(userId)
//     .populate('followers')
//     .select('followers')
//     .lean();

//   const followersCount = user?.followers?.length ?? 0;

//   return { followers: user?.followers, followersCount };
// };

export const UserServices = {
  getAllUsersFromDB,
  getMeFromDB,
  getSingleUserFromDB,
  updateMyProfile,
  deleteUserFromDB,
};
