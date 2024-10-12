import { Schema, model } from 'mongoose';
import { TStatusUpgrade } from './statusUpgrade.interface';

const statusUpgradeSchema = new Schema<TStatusUpgrade>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const StatusUpgrade = model<TStatusUpgrade>(
  'StatusUpgrade',
  statusUpgradeSchema,
);
