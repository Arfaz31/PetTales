/* eslint-disable @typescript-eslint/no-unused-vars */
import { join } from 'path';
import { UnlockPost } from '../UnlockPost/unlockPost.model';
import { readFileSync } from 'fs';
import { verifyPayment } from './payment.utils';
import AppError from '../../Error/AppError';
import httpStatus from 'http-status';
import { StatusUpgrade } from '../Status-Upgrade/statusUpgrade.model';
import { User } from '../User/user.model';
import { Post } from '../Post/post.model';

const confirmationService = async (
  transactionId: string,
  status: string,
  paymentType: string,
) => {
  const verifyResponse = await verifyPayment(transactionId);

  let message = '';
  let description = '';

  if (verifyResponse && verifyResponse.pay_status === 'Successful') {
    if (paymentType === 'unlockPost') {
      // UnlockPost payment confirmation logic
      const result = await UnlockPost.findOneAndUpdate(
        { transactionId },
        { paymentStatus: 'Paid' },
        { new: true },
      );

      if (!result) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          'UnlockPost transaction not found',
        );
      }

      // Add the user ID to `isUnlockedBy` in the Post document
      await Post.findByIdAndUpdate(result.postId, {
        $addToSet: { isUnlockedBy: result.userId }, // Avoid duplicate entries
      });

      message = 'Successfully Paid!';
      description =
        'Your payment was successful! You can now access your content.';
    } else if (paymentType === 'statusUpgrade') {
      // StatusUpgrade payment confirmation logic
      const upgrade = await StatusUpgrade.findOneAndUpdate(
        { transactionId },
        { paymentStatus: 'Paid' },
        { new: true },
      );

      if (!upgrade) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          'Status upgrade transaction not found',
        );
      }
      const user = await User.findById(upgrade.userId).select('+password');
      console.log('Before saving:', user?.password);

      if (user) {
        user.status = 'premium';
        await user.save();
        console.log('After saving:', user.password);
      }

      message = 'Successfully upgraded to premium!';
      description = 'Your account has been upgraded to premium status.';
    }
  } else {
    message = 'Payment Failed!';
    description =
      'Unfortunately, your payment failed. Please try again or contact support.';
  }

  const filePath = join(__dirname, '../../../views/confirmation.html');
  let template = readFileSync(filePath, 'utf-8');

  // Replace placeholders with actual values
  template = template
    .replace('{{message}}', message)
    .replace('{{description}}', description);

  return template;
};

export const paymentServices = {
  confirmationService,
};
