import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CommentServices } from "./comment.services";

const createComment = catchAsync(async (req, res) => {
    const { post, content } = req.body;
    const userId = req.user._id; 
    const commentData = { post, user: userId, content };
  
    const result = await CommentServices.createCommentIntoDB(commentData);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Comment created successfully',
      data: result,
    });
  });

  const updateComment = catchAsync(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;
  
    const result = await CommentServices.updateCommentInDB(commentId, userId, content);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Comment updated successfully',
      data: result,
    });
  });

  const deleteComment = catchAsync(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;
  
    const result = await CommentServices.deleteCommentInDB(commentId, userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Comment deleted successfully',
      data: result,
    });
  });

  const deleteCommentAsPostOwner = catchAsync(async (req, res) => {
    const { commentId, postId } = req.params;
    const ownerId = req.user._id;
  
    const result = await CommentServices.deleteCommentAsPostOwner(commentId, postId, ownerId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Comment deleted by post owner successfully',
      data: result,
    });
  });

  const getComments = catchAsync(async (req, res) => {
    const { postId } = req.params;
  
    const result = await CommentServices.getCommentsByPostId(postId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Comments retrieved successfully',
      data: result,
    });
  });

  const getTotalComment = catchAsync(async (req, res) => {
    const { postId } = req.params;
  
    const result = await CommentServices.getTotalCommentsByPostId(postId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Total comments count retrieved successfully',
      data: result,
    });
  });

  export const CommentController ={
    createComment,
    updateComment,
    deleteComment,
    deleteCommentAsPostOwner,
    getComments,
    getTotalComment

  }