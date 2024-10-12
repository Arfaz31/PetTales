import httpStatus from 'http-status';
import AppError from '../../Error/AppError';
import { User } from '../User/user.model';
import { TStatusUpgrade } from './statusUpgrade.interface';
import { initiatePayment } from '../payment/payment.utils';
import { StatusUpgrade } from './statusUpgrade.model';

const PayForStatusUpgrade = async (
  userId: string,
  status: 'basic' | 'premium',
  payload: TStatusUpgrade,
) => {
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'Your account has been deleted');
  }

  if (status === 'premium') {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is already premium.');
  }

  const transactionId = `TXN-${Date.now()}`;
  const statusUpgradeData = {
    userId: userId,
    amount: Number(payload.amount),
    paymentStatus: 'Pending',
    transactionId,
  };
  // console.log('statusUpgradeData:', statusUpgradeData);

  await StatusUpgrade.create(statusUpgradeData);

  const paymentData = {
    transactionId,
    amount: Number(payload.amount),
    custormerName: user.name,
    customerEmail: user.email,
    customerPhone: user.mobileNumber,
    customerAddress: user.address,
    paymentType: 'statusUpgrade',
  };
  // console.log('paymentData:', paymentData);

  //payment
  const paymentSession = await initiatePayment(paymentData);

  console.log('paymentSession:', paymentSession);

  return paymentSession;
};

export const StatusUpgradeServices = {
  PayForStatusUpgrade,
};
