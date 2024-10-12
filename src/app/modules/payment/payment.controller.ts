import catchAsync from '../../utils/catchAsync';
import { paymentServices } from './payment.services';

const confirmationController = catchAsync(async (req, res) => {
  const { transactionId, status, paymentType } = req.query;

  const result = await paymentServices.confirmationService(
    transactionId as string,
    status as string,
    paymentType as string, // Pass the payment type here
  );

  res.send(result);
});

export const paymentControler = {
  confirmationController,
};
