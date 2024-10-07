import { z } from 'zod';

export const createCommentSchema = z.object({
  post: z.string(),
  user: z.string(),
  content: z.string().min(1, 'Content is required'),
});

export const updateCommentSchema = z.object({
  commentId: z.string(),
  content: z.string().min(1, 'Updated content is required'),
});
