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
  let redirectUrl = 'https://pettales.vercel.app/';

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

      redirectUrl = `https://pettales.vercel.app/newsfeed/posts/${result.postId}`;
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
      // console.log('Before saving:', user?.password);

      if (user) {
        user.status = 'premium';
        await user.save();
        // console.log('After saving:', user.password);
      }

      redirectUrl = `https://pettales.vercel.app/newsfeed/userprofile/${upgrade.userId}`;
      message = 'Successfully upgraded to premium!';
      description = 'Your account has been upgraded to premium status.';
    }
  } else {
    message = 'Payment Failed!';
    description =
      'Unfortunately, your payment failed. Please try again or contact support.';
  }

  // const filePath = join(__dirname, '../../../views/confirmation.html');
  // let template = readFileSync(filePath, 'utf-8');

  // // Replace placeholders with actual values
  // template = template
  //   .replace('{{message}}', message)
  //   .replace('{{description}}', description)
  //   .replace('{{redirectUrl}}', redirectUrl); // Set the dynamic URL

  return `
  <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payment Confirmation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }

      .confirmation-container {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 2rem;
        text-align: center;
        width: 100%;
        max-width: 500px;
      }

      .confirmation-container h1 {
        font-size: 2rem;
        margin-bottom: 1rem;
      }

      .confirmation-container p {
        color: #555;
        font-size: 1.1rem;
        line-height: 1.6;
      }

      .button {
        margin-top: 1.5rem;
        padding: 0.75rem 1.5rem;
        background-color: #10798b;
        color: #fff;
        text-decoration: none;
        border-radius: 5px;
        font-size: 1rem;
      }

      .button:hover {
        background-color: #0a5c6b;
      }
    </style>
  </head>

  <body>
   <div class="confirmation-container">
          <h1>${message}</h1>
          <p>${description}</p>
          <a href="${redirectUrl}" class="button">Go Back</a>
        </div>
  </body>
</html>

  `;
};

export const paymentServices = {
  confirmationService,
};
