import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UnlockPostServices } from './unlockPost.services';

const accessUnlockPost = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const result = await UnlockPostServices.accessUnlockPostViaPayment(
    _id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'UnlockPost created successfully',
    data: result,
  });
});

export const UnlockPostController = {
  accessUnlockPost,
};
