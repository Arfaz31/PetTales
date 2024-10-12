import { z } from 'zod';

const createStatusUpgradeValidationSchema = z.object({
  body: z.object({
    amount: z.number(),
  }),
});

export { createStatusUpgradeValidationSchema };
