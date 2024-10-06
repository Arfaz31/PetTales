import { Types } from 'mongoose';

export type TPost = {
  _id?: string;
  title: string;
  content: string;
  user: Types.ObjectId;
  images?: string[];
  category: 'Tip' | 'Story';
  isPremium: boolean;
  upvotes: number;
  downvotes: number;
  createdAt?: Date;
  comments?: Types.ObjectId[];
};
