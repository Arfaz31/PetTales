// import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
// import config from '../config';
// import multer from 'multer';
// import fs from 'fs';

// cloudinary.config({
//   cloud_name: config.cloudinary_cloud_name,
//   api_key: config.cloudinary_api_key,
//   api_secret: config.cloudinary_api_secret,
// });

// // Function to upload images to Cloudinary
// export const sendImageToCloudinary = (
//   imageName: string,
//   path: string,
// ): Promise<Record<string, unknown>> => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(
//       path, //image er location
//       { public_id: imageName },
//       function (error, result) {
//         if (error) {
//           reject(error);
//         }
//         resolve(result as UploadApiResponse);
//         // console.log(result)
//         // delete a file asynchronously
//         fs.unlink(path, (err) => {
//           if (err) {
//             console.log(err);
//           } else {
//             console.log('File is deleted.');
//           }
//         });
//       },
//     );
//   });
// };

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, process.cwd() + '/uploads/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + '-' + uniqueSuffix);
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 30 * 1024 * 1024, // Limit to 30 MB for all files
//   },
// });

// // Single file uploads for profilePhoto and coverImg
// export const uploadSingleImage = upload.fields([
//   { name: 'profilePhoto', maxCount: 1 },
//   { name: 'coverImg', maxCount: 1 },
// ]);
// export const uploadMultipleImage = upload.fields([
//   { name: 'postImages', maxCount: 10 },
// ]);
