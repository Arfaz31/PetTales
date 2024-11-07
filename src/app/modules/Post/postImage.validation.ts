import { z } from 'zod';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 30; // 30mb
const ACCEPTED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'png',
  'jpeg',
  'jpg',
] as const;

const ImageFileZodSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.enum(ACCEPTED_FILE_TYPES),
  path: z.string(),
  size: z
    .number()
    .refine(
      (size) => size <= MAX_UPLOAD_SIZE,
      'File size must be less than 4MB',
    ),
  filename: z.string(),
});

export const ImageFilesArrayZodSchema = z.object({
  // files: z.record(z.string(), z.array(ImageFileZodSchema)).refine((files) => {
  //   return Object.keys(files).length > 0;
  // }, 'Image is required'),
  files: z.record(z.string(), z.array(ImageFileZodSchema)).optional(), // Mark files as optional
});

//The refine method allows you to create custom validation rules. Without the refine, the schema would simply check if the files field exists, but it wouldn't verify if it contains any actual files. This refinement ensures that at least one file is uploaded. If no files are provided, it will trigger the custom error message 'Image is required'.
