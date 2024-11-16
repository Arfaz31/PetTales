import { Post } from '../Post/post.model';

const getAllPostsForAdmin = async (query: Record<string, unknown>) => {
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

  let contentTypeQuery = {};
  if (query?.contentType && query.contentType !== 'All Content') {
    contentTypeQuery = { contentType: query.contentType };
  }

  const excludeFields = [
    'searchTerm',
    'sortBy',
    'limit',
    'page',
    'category',
    'contentType',
  ];
  excludeFields.forEach((el) => delete queryObj[el]);

  const combinedQuery = {
    ...queryObj,
    ...categoryQuery,
    ...contentTypeQuery,
  };

  // console.log('Combined Query:', combinedQuery);

  const posts = await sortQuery
    .find(combinedQuery)
    .populate('user', '_id name username email profilePhoto status coverImg') // Populate post user info
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
  return { posts, hasMore, totalPosts, totalPages };
};

export const AdminServices = {
  getAllPostsForAdmin,
};
