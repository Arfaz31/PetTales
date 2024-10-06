import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.services';
// import { TImageFile } from '../../Interface/image.interface';

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User are retrieved successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { _id, role } = req.user;

  const result = await UserServices.getMeFromDB(_id, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${role} profile is retrieved succesfully`,
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.getSingleUserFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req, res) => {
  // Cast req.files to the correct type
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  // Extract single files from the fields
  const profilePhoto = files?.profilePhoto ? files.profilePhoto[0] : undefined;
  const coverImg = files?.coverImg ? files.coverImg[0] : undefined;

  // Proceed to update the profile
  const result = await UserServices.updateMyProfile(
    req.user,
    req.body, // This can be an empty object if only files are provided
    profilePhoto, // Pass single file or undefined
    coverImg, // Pass single file or undefined
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Profile updated successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.deleteUserFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User is deleted successfully',
    data: result,
  });
});

// const followUser = catchAsync(async (req, res) => {
//   const { id: followedUserId } = req.params; // User B (the user being followed)
//   const currentUserId = req.user._id; // User A (the current logged-in user)
//   const result = await UserServices.CreateFollowUser(
//     followedUserId,
//     currentUserId,
//   );
//   // res.status(200).json({
//   //   success: true,
//   //   message: 'User is followed successfully',
//   //   data: result,
//   // });
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: 'Successfully followed the user',
//     data: result,
//   });
// });

// const unfollowUser = catchAsync(async (req, res) => {
//   const { id: unfollowedUserId } = req.params; // User B (the user being unfollowed)
//   const currentUserId = req.user._id; // User A (the current logged-in user)
//   const result = await UserServices.RemoveFollowUser(
//     unfollowedUserId,
//     currentUserId,
//   );
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: 'Successfully unfollowed the user',
//     data: result,
//   });
// });

// const getFollowings = catchAsync(async (req, res) => {
//   const { _id } = req.user; // Assuming you have user ID from request
//   const currentUserId = _id;
//   const result = await UserServices.getUserFollowings(currentUserId);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: 'Followings are retrieved successfully',
//     data: result,
//   });
// });

// const getFollowers = catchAsync(async (req, res) => {
//   const currentUserId = req.user._id;

//   const result = await UserServices.getUserFollowers(currentUserId);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: 'Followers are retrieved successfully',
//     data: result,
//   });
// });

export const UserController = {
  getAllUsers,
  getMe,
  getSingleUser,
  updateMyProfile,
  deleteUser,
  // followUser,
  // unfollowUser,
  // getFollowings,
  // getFollowers,
};
