import { z } from 'zod';

const createCommentZodSchema = z.object({
  body: z.object({
    post: z.string(),
    content: z.string().min(1, 'Content is required'),
  }),
});

const updateCommentZodSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Updated content is required'),
  }),
});

export const CommentValidation = {
  createCommentZodSchema,
  updateCommentZodSchema,
};
