import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { ChatServices } from './chat.services';

// export const createChat = catchAsync(async (req, res) => {
//   const result = await ChatServices.createChat(req.body);
//   sendResponse(res, {
//     statusCode: httpStatus.CREATED,
//     success: true,
//     message: 'Chat created successfully',
//     data: result,
//   });
// });

export const getUserChats = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ChatServices.userChats(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User chats retrieved successfully',
    data: result,
  });
});
export const getSpeficicChat = catchAsync(async (req, res) => {
  const { userId1, userId2 } = req.params;
  const result = await ChatServices.findChat(userId1, userId2);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Chat retrieved successfully',
    data: result,
  });
});

export const ChatController = {
  getUserChats,
};
