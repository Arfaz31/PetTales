import { z } from 'zod';

export const followValidationSchema = z.object({
  followerId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid follower ID'),
  followingId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid following ID'),
});
