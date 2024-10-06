import { Schema, model } from 'mongoose';
import { TFollow } from './follow.interface';

const followSchema = new Schema<TFollow>(
  {
    follower: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // The user who follows
    following: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // The user who is being followed
  },
  { timestamps: true },
);

export const Follow = model<TFollow>('Follow', followSchema);
