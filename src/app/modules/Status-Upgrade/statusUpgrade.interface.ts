import { Types } from 'mongoose';

export type TStatusUpgrade = {
  _id?: string;
  userId: Types.ObjectId;
  paymentStatus: 'Pending' | 'Paid';
  amount: number;
  transactionId: string;
};
