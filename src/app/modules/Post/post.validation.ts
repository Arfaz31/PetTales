import { z } from 'zod';

const createPostZodSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title is required'),
    content: z.string().min(10, 'Content is required'),
    // user: z.string(),
    category: z.enum(['Tip', 'Story']),
    contentType: z.enum(['basic', 'premium']),
    isPublished: z.boolean().default(true),
  }),
});
const updatePostZodSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title is required').optional(),
    content: z.string().min(10, 'Content is required').optional(),
    category: z.enum(['Tip', 'Story']).optional(),
    contentType: z.enum(['basic', 'premium']).optional(),
    isPublished: z.boolean().default(true).optional(),
  }),
});

export { createPostZodSchema, updatePostZodSchema };
