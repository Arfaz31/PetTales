import { z } from 'zod';

export const likeSchema = z.object({
  post: z.string(),
  user: z.string(),
  isUpvote: z.boolean(),
});
