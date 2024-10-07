import { z } from 'zod';
import mongoose from 'mongoose';

const createLikeZodSchema = z.object({
  postId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: 'Invalid Post ID',
  }),
});

export { createLikeZodSchema };
