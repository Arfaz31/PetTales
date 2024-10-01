import { z } from 'zod';
import { USER_Role, USER_STATUS } from './user.constant';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    role: z.nativeEnum(USER_Role).default(USER_Role.user),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({
        message: 'Invalid email',
      }),
    password: z.string({
      required_error: 'Password is required',
    }),
    profilePhoto: z.string().optional(),
    status: z.nativeEnum(USER_STATUS).default(USER_STATUS.basic),
    passwordChangedAt: z.date().optional(),
    followers: z
      .array(
        z.string().refine((val) => val.match(/^[0-9a-fA-F]{24}$/), {
          message: 'Invalid ObjectId for follower',
        }),
      )
      .optional(),
    following: z
      .array(
        z.string().refine((val) => val.match(/^[0-9a-fA-F]{24}$/), {
          message: 'Invalid ObjectId for following',
        }),
      )
      .optional(),
    mobileNumber: z.string().optional(),
    about: z.string().optional(),
    contactNo: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    address: z.string().optional(),
    coverImg: z.string().optional(),
    isDeleted: z.boolean().default(false),
  }),
});

export { createUserValidationSchema };
