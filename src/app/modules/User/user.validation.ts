import { z } from 'zod';
import { USER_Role, USER_STATUS } from './user.constant';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({
        message: 'Invalid email format',
      }),
    password: z.string({
      required_error: 'Password is required',
    }),
    mobileNumber: z.string({
      required_error: 'Mobile numberis required',
    }),
    gender: z.enum(['male', 'female', 'other'], {
      required_error: 'Gender is required',
    }),
    role: z.nativeEnum(USER_Role).default(USER_Role.user),
    status: z.nativeEnum(USER_STATUS).default(USER_STATUS.basic),

    passwordChangedAt: z.date().optional(),
    // profilePhoto: z.string().optional(),
    // coverImg: z.string().optional(),
    address: z.string().optional(),
    about: z.string().optional(),
    isDeleted: z.boolean().default(false),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .optional(),

    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({
        message: 'Invalid email format',
      })
      .optional(),

    password: z
      .string({
        required_error: 'Password is required',
      })
      .optional(),

    mobileNumber: z
      .string({
        required_error: 'Mobile number is required',
      })
      .optional(),

    gender: z
      .enum(['male', 'female', 'other'], {
        required_error: 'Gender is required',
      })
      .optional(),

    role: z.nativeEnum(USER_Role).default(USER_Role.user).optional(),

    status: z.nativeEnum(USER_STATUS).default(USER_STATUS.basic).optional(),

    // // Followers field: optional, default empty array, validating ObjectId
    // followers: z
    //   .array(
    //     z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    //       message: 'Invalid ObjectId for follower',
    //     }),
    //   )
    //   .optional()
    //   .default([]),

    // // Following field: optional, default empty array, validating ObjectId
    // following: z
    //   .array(
    //     z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    //       message: 'Invalid ObjectId for following',
    //     }),
    //   )
    //   .optional()
    //   .default([]),

    passwordChangedAt: z.date().optional(),
    // profilePhoto: z.string().optional(),
    // coverImg: z.string().optional(),
    address: z.string().optional(),
    about: z.string().optional(),
    isDeleted: z.boolean().default(false).optional(),
  }),
});

export { createUserValidationSchema, updateUserValidationSchema };
