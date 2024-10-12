import { Schema, model } from 'mongoose';
import { TPost } from './post.interface';

const postSchema = new Schema<TPost>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    images: {
      type: [String],
      default: null,
    },
    category: {
      type: String,
      enum: ['Tip', 'Story'],
      required: true,
    },
    contentType: {
      type: String,
      enum: ['basic', 'premium'],
      required: true,
    },
    price: {
      type: Number,
      required: function () {
        return this.contentType === 'premium';
      },
    }, // Premium posts must have a price
    // unlockedBy: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //   },
    // ], // Users who unlocked this post
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Post = model<TPost>('Post', postSchema);
