import { z } from 'zod';

const createStatusUpgradeValidationSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be a positive number.'),
  }),
});

export { createStatusUpgradeValidationSchema };
