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
  // unlockedBy?: Types.ObjectId[]; // Users who unlocked premium post
  isPublished?: boolean;
};
