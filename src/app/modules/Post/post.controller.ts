import httpStatus from 'http-status';
import AppError from '../../Error/AppError';
import { TImageFiles } from '../../Interface/image.interface';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PostServices } from './post.services';

const createPost = catchAsync(async (req, res) => {
  if (!req.files) {
    throw new AppError(400, 'Please upload an image');
  }
  const { status, _id } = req.user; // user status and id

  //   const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const result = await PostServices.createPost(
    req.body,
    status,
    _id,
    req.files as TImageFiles,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Post is created successfully',
    data: result,
  });
});

const getAllPosts = catchAsync(async (req, res) => {
  const result = await PostServices.getAllPosts();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Posts retrieved successfully',
    data: result,
  });
});

const getSinglePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const post = await PostServices.getSinglePost(id, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post retrieved successfully',
    data: post,
  });
});

const getMyAllPosts = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const result = await PostServices.getMyAllPosts(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Your posts retrieved successfully',
    data: result,
  });
});

const updateMyPost = catchAsync(async (req, res) => {
  const { id } = req.params; // Get the post ID from params
  const userId = req.user._id;
  const result = await PostServices.updateMyPost(
    id,
    userId,
    req.body,
    req.files as TImageFiles,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post updated successfully',
    data: result,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params; // Get the post ID from params
  const userId = req.user._id;
  const result = await PostServices.deletePostFromDB(id, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post deleted successfully',
    data: result,
  });
});

const unpublishPost = catchAsync(async (req, res) => {
  const { id } = req.params; // Get the post ID from the request params

  const result = await PostServices.unpublishPost(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post unpublished successfully',
    data: result,
  });
});
export const PostController = {
  createPost,
  getAllPosts,
  getSinglePost,
  getMyAllPosts,
  updateMyPost,
  deletePost,
  unpublishPost,
};
