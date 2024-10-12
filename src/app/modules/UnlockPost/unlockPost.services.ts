import httpStatus from 'http-status';
import AppError from '../../Error/AppError';
import { User } from '../User/user.model';
import { TUnlockPost } from './unlockPost.interface';
import { Post } from '../Post/post.model';
import { UnlockPost } from './unlockPost.model';
import { initiatePayment } from '../payment/payment.utils';

const accessUnlockPostViaPayment = async (
  userId: string,
  payload: TUnlockPost,
) => {
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'Your account has been deleted');
  }
  const post = await Post.findOne({ _id: payload.postId });
  // console.log('Post:', post);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const transactionId = `TXN-${Date.now()}`;
  const unLockPostData = {
    userId: userId,
    postId: post._id,
    amount: Number(post.price),
    paymentStatus: 'Pending',
    transactionId,
  };
  // console.log('unLockPostData:', unLockPostData);

  await UnlockPost.create(unLockPostData);

  const paymentData = {
    transactionId,
    amount: Number(post.price),
    custormerName: user.name,
    customerEmail: user.email,
    customerPhone: user.mobileNumber,
    customerAddress: user.address,
  };
  // console.log('paymentData:', paymentData);

  //payment
  const paymentSession = await initiatePayment(paymentData);

  console.log('paymentSession:', paymentSession);

  return paymentSession;
};

export const UnlockPostServices = {
  accessUnlockPostViaPayment,
};
