/* eslint-disable @typescript-eslint/no-unused-vars */
import { join } from 'path';
import { UnlockPost } from '../UnlockPost/unlockPost.model';
import { readFileSync } from 'fs';
import { verifyPayment } from './payment.utils';

const confirmationService = async (transactionId: string, status: string) => {
  const verifyResponse = await verifyPayment(transactionId);
  // console.log('verifyResponse:', verifyResponse);

  let result;
  let message = '';
  let description = '';
  if (verifyResponse && verifyResponse.pay_status === 'Successful') {
    result = await UnlockPost.findOneAndUpdate(
      { transactionId },
      {
        paymentStatus: 'Paid',
      },
      { new: true }, // Use this option to return the updated document
    );
    message = 'Successfully Paid!';
    description =
      'Your payment was successful! You can now access your content.';
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
