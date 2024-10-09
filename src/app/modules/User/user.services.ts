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

export const UserServices = {
  getAllUsersFromDB,
  getMeFromDB,
  getSingleUserFromDB,
  updateMyProfile,
  deleteUserFromDB,
};
