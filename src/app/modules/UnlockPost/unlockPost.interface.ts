import { Types } from 'mongoose';

export type TUnlockPost = {
  _id?: string;
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  amount: number;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  transactionId: string;
};
