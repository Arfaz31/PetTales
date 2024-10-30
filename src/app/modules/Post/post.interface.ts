import { Types } from 'mongoose';

export type TPost = {
  _id?: string;
  title: string;
  content: string;
  user: Types.ObjectId;
  images?: string[];
  category: 'Tip' | 'Story';
  contentType: 'basic' | 'premium';
  price?: number; // Price for premium posts
  comments: Types.ObjectId[];
  like: Types.ObjectId[];
  disLike: Types.ObjectId[];
  isPublished?: boolean;
  isUnlockedBy?: Types.ObjectId[];
};
