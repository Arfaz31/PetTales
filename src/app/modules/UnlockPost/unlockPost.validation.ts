import { z } from 'zod';

const createUnlockPremiumPostValidationSchema = z.object({
  body: z.object({
    postId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid postId ID'),
  }),
});

export { createUnlockPremiumPostValidationSchema };
