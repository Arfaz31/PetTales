import AppError from '../../Error/AppError';
import { TImageFiles } from '../../Interface/image.interface';
import { sendImageToCloudinary } from '../../utils/sendingImageToCloudinary';
import { UnlockPost } from '../UnlockPost/unlockPost.model';
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

  // Check if the user is trying to create premium content with basic status
  if (
    status === 'basic' &&
    payload.contentType === 'premium' &&
    user.role !== 'admin'
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Basic users can only create basic content',
    );
  }

  const { postImages } = images;

  // if (!postImages || postImages.length === 0) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     'No images uploaded. Please upload images.',
  //   );
  // }
  // Logging the postImages array to check what files multer receives
  //   console.log(
  //     'Received post images:',
  //     postImages.map((img) => img.path),
  //   );

  //Uploads each image to Cloudinary using Promise.all to handle multiple asynchronous uploads.
  // const uploadedImages = await Promise.all(
  //   postImages.map((image, index) => {
  //     // Log the image being uploaded
  //     //   console.log(`Uploading image ${index + 1}: ${image.path}`);
  //     return sendImageToCloudinary(
  //       `${userId}_postImage_${index + 1}`,
  //       image.path,
  //     );
  //   }),
  // );

  // If no images were uploaded, proceed without uploading any images
  if (!postImages || postImages.length === 0) {
    payload.images = []; // Set images as an empty array or handle it accordingly
  } else {
    // Uploads each image to Cloudinary using Promise.all to handle multiple asynchronous uploads.
    const uploadedImages = await Promise.all(
      postImages.map((image, index) => {
        return sendImageToCloudinary(
          `${userId}_postImage_${index + 1}`,
          image.path,
        );
      }),
    );

    // Map the uploaded image URLs to payload
    payload.images = uploadedImages.map((img) => img.secure_url as string);
  }

  const post = await Post.create({ ...payload, user: userId });
  return post;
};

const getAllPosts = async (query: Record<string, unknown>) => {
  const queryObj = { ...query };

  const postSearchableFields = ['title', 'content'];
  let searchTerm = '';

  if (query?.searchTerm) {
    searchTerm = query?.searchTerm as string;
  }

  const searchQuery = Post.find({
    $or: postSearchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    })),
  });

  const limit: number = Number(query?.limit || 8);
  let skip: number = 0;

  if (query?.page) {
    const page: number = Number(query?.page || 1);
    skip = (page - 1) * limit;
  }

  const skipQuery = searchQuery.skip(skip);
  const limitQuery = skipQuery.limit(limit);

  const sortBy = '-createdAt';

  const sortQuery = limitQuery.sort(sortBy);

  // Add category filter only if a specific category is selected
  let categoryQuery = {};
  if (query?.category && query.category !== 'All Posts') {
    categoryQuery = { category: query.category };
  }

  const excludeFields = ['searchTerm', 'sortBy', 'limit', 'page', 'category'];
  excludeFields.forEach((el) => delete queryObj[el]);

  const combinedQuery = {
    ...queryObj,
    ...categoryQuery,
  };

  // console.log('Combined Query:', combinedQuery);

  const posts = await sortQuery
    .find(combinedQuery)
    .populate('user', 'name profilePhoto') // Populate post user info
    .populate({
      path: 'comments',
      populate: [
        { path: 'user', select: 'name profilePhoto' }, // Populate comment user info
        {
          path: 'post',
          select: 'title user',
          populate: { path: 'user', select: '_id' }, // Populate post owner’s _id within comments
        },
      ],
    })
    .populate('like', '_id name profilePhoto') // Populate user info in each like
    .populate('disLike', '_id name profilePhoto'); // Populate user info in each dislike

  // Get the total count of posts for pagination
  const totalPosts = await Post.countDocuments(combinedQuery);
  const hasMore = skip + limit < totalPosts;
  const totalPages = Math.ceil(totalPosts / limit);
  return { posts, hasMore, totalPages };
};

const getSinglePost = async (postId: string, userId: string) => {
  const post = await Post.findById(postId)
    .populate('user', 'name profilePhoto')
    .populate({
      path: 'comments',
      populate: [
        { path: 'user', select: 'name profilePhoto' },
        {
          path: 'post',
          select: 'title user',
          populate: { path: 'user', select: '_id' },
        },
      ],
    })
    .populate('like', '_id name profilePhoto')
    .populate('disLike', '_id name profilePhoto');

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isPostOwner = String(post.user._id) === String(userId);
  const isAdmin = user.role === 'admin';

  if (isPostOwner || isAdmin) {
    return post;
  }

  if (post.contentType === 'premium') {
    const unlockPost = await UnlockPost.findOne({
      userId: userId,
      postId: post._id,
      paymentStatus: 'Paid',
    });

    if (!unlockPost) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'Access denied. You need to unlock this premium post to access the content.',
      );
    }
  }

  return post;
};

const getMyAllPosts = async (userId: string) => {
  const posts = await Post.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('user', 'name profilePhoto')
    .populate({
      path: 'comments',
      populate: [
        { path: 'user', select: 'name profilePhoto' },
        {
          path: 'post',
          select: 'title user',
          populate: { path: 'user', select: '_id' },
        },
      ],
    })
    .populate('like', '_id name profilePhoto')
    .populate('disLike', '_id name profilePhoto');
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
const publishPost = async (postId: string) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  // Unpublish the post by setting `isPublished` to `false`
  post.isPublished = true;

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
  publishPost,
};
