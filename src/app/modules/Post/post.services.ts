import AppError from '../../Error/AppError';
import { TImageFiles } from '../../Interface/image.interface';
import { sendImageToCloudinary } from '../../utils/sendingImageToCloudinary';
import { User } from '../User/user.model';
import { TPost } from './post.interface';
import { Post } from './post.model';

import httpStatus from 'http-status';

const createPost = async (
  payload: TPost,
  status: 'basic' | 'premium',
  userId: string,
  images: TImageFiles,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.isDeleted === true) {
    throw new AppError(httpStatus.FORBIDDEN, 'your account has been deleted');
  }

  if (status === 'basic' && payload.contentType === 'premium') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Basic users can only create basic content',
    );
  }

  const { postImages } = images;

  if (!postImages || postImages.length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'No images uploaded. Please upload images.',
    );
  }
  // Logging the postImages array to check what files multer receives
  //   console.log(
  //     'Received post images:',
  //     postImages.map((img) => img.path),
  //   );

  // Upload multiple images to Cloudinary
  //Uploads each image to Cloudinary using Promise.all to handle multiple asynchronous uploads.
  const uploadedImages = await Promise.all(
    postImages.map((image, index) => {
      // Log the image being uploaded
      //   console.log(`Uploading image ${index + 1}: ${image.path}`);
      return sendImageToCloudinary(
        `${userId}_postImage_${index + 1}`,
        image.path,
      );
    }),
  );

  // Map the uploaded image URLs to payload
  payload.images = uploadedImages.map((img) => img.secure_url as string);

  const post = await Post.create({ ...payload, user: userId });
  return post;
};

const getAllPosts = async () => {
  const posts = await Post.find().sort({ createdAt: -1 }); // Sort by latest
  return posts;
};

const getSinglePost = async (postId: string, userRole: string) => {
  const post = await Post.findById(postId).populate('user');
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  // Check if the post is premium and the user has a basic role
  if (post.contentType === 'premium' && userRole === 'basic') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Access denied. Premium content is restricted to premium users.',
    );
  }

  return post;
};

const getMyAllPosts = async (userId: string) => {
  const posts = await Post.find({ user: userId }).sort({ createdAt: -1 }); // Sort by latest
  return posts;
};

const updateMyPost = async (
  postId: string,
  userId: string,
  data: Partial<TPost> = {}, // Default to empty object if no data is provided
  images?: TImageFiles,
) => {
  const profile = await User.findById(userId);

  if (!profile)
    throw new AppError(httpStatus.NOT_FOUND, 'User profile does not exist!');

  if (profile.isDeleted === true) {
    throw new AppError(httpStatus.FORBIDDEN, 'your account has been deleted');
  }

  const post = await Post.findOne({ _id: postId, user: userId });
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  if (post.isPublished === false) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post is not published');
  }

  // Upload new images to Cloudinary if provided
  const postImages = images?.postImages ?? [];

  // Upload images to Cloudinary and map the URLs to `uploadedImages`
  const uploadedImages = await Promise.all(
    postImages.map((image, index) =>
      sendImageToCloudinary(`${userId}_postImage_${index + 1}`, image.path),
    ),
  );

  // If new images are provided, merge with existing images, else retain old images
  if (uploadedImages.length > 0) {
    // Ensure post.images is an array before spreading it
    data.images = [
      ...(post.images ?? []),
      ...uploadedImages.map((img) => img.secure_url as string),
    ];
  } else {
    // If no new images are uploaded, retain the existing images
    data.images = post.images ?? [];
  }

  // If no data or files are provided, simply return the current profile
  if (Object.keys(data).length === 0) {
    return profile;
  }

  return await Post.findByIdAndUpdate(postId, data, { new: true });
};

const deletePostFromDB = async (postId: string, userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.isDeleted === true) {
    throw new AppError(httpStatus.FORBIDDEN, 'your account has been deleted');
  }

  const post = await Post.findOne({ _id: postId, user: userId }); // set the postId and userId to the _id and user fields respectively in the post model to match the fields in the database.
  if (!post) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Post not found or you do not have permission to delete this post',
    );
  }
  const result = await Post.findByIdAndDelete(postId);
  return result;
};

const unpublishPost = async (postId: string) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  // Unpublish the post by setting `isPublished` to `false`
  post.isPublished = false;

  await post.save();

  return post;
};

export const PostServices = {
  createPost,
  getAllPosts,
  getSinglePost,
  getMyAllPosts,
  updateMyPost,
  deletePostFromDB,
  unpublishPost,
};
