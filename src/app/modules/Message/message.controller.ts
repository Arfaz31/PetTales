import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { MessageServices } from './message.services';

export const addMessage = catchAsync(async (req, res) => {
  const result = await MessageServices.addMessage(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Message sent successfully',
    data: result,
  });
});

export const getMessages = catchAsync(async (req, res) => {
  const { chatId } = req.params;
  const result = await MessageServices.getMessages(chatId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Messages retrieved successfully',
    data: result,
  });
});

const MessageController = {
  addMessage,
  getMessages,
};

export default MessageController;
