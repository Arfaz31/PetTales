import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminServices } from './admin.services';

const getAllPosts = catchAsync(async (req, res) => {
  const result = await AdminServices.getAllPostsForAdmin(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Posts retrieved successfully',
    data: result,
  });
});

export const AdminController = {
  getAllPosts,
};
