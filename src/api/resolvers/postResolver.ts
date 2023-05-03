import {Like} from '../../interfaces/Like';
import {Post} from '../../interfaces/Post';
import {User, UserIdWithToken} from '../../interfaces/User';
import postModel from '../models/postModel';
import {GraphQLError} from 'graphql';
import {Types} from 'mongoose';
import likeModel from '../models/likeModel';
export default {
  Like: {
    post: async (parent: Like) => {
      return await postModel.findById(parent.post);
    },
  },
  Query: {
    //get all posts
    posts: async () => {
      console.log('posts');
      const posts = await postModel.find();
      const postIds = posts.map((post) => post._id);

      // Then, find all likes that match those post IDs
      const likes = await likeModel.aggregate([
        {$match: {post: {$in: postIds}}},
        {$group: {_id: '$post', count: {$sum: 1}}},
      ]);

      // Iterate over the posts and assign the likes value for each post
      posts.forEach((post) => {
        const like = likes.find((like) => like._id.equals(post._id));
        post.likes = like ? like.count : 0;
      });

      return posts;
    },
    //get post by id
    postById: async (_parent: unknown, args: Post) => {
      console.log('postById');

      const post = await postModel.findById(args.id);
      if (post) {
        // Then, find the number of likes for the post
        const likes = await likeModel.countDocuments({post: args.id});

        // Assign the likes value to the post and return it
        post.likes = likes;
      }
      return post;
    },
    //get posts by user
    postsByUser: async (_parent: unknown, args: Post) => {
      const posts = await postModel.find({user: args.id});
      const postIds = posts.map((post) => post._id);
      // Then, find all likes that match those post IDs
      const likes = await likeModel.aggregate([
        {$match: {post: {$in: postIds}}},
        {$group: {_id: '$post', count: {$sum: 1}}},
      ]);

      // Iterate over the posts and assign the likes value for each post
      posts.forEach((post) => {
        const like = likes.find((like) => like._id.equals(post._id));
        post.likes = like ? like.count : 0;
      });
      return posts;
    },
  },
  Mutation: {
    createPost: async (_parent: unknown, args: Post, user: UserIdWithToken) => {
      console.log('createPost');

      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      args.user = user.id as unknown as Types.ObjectId;
      console.log(args);
      const post = new postModel(args);
      console.log(post);

      const result = await post.save();
      console.log(result);
      return result;
    },

    updatePost: async (
      _parent: unknown,
      args: {id: string; post: Post},
      user: UserIdWithToken
    ) => {
      console.log('updatePost');

      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      console.log('arg', args);
      console.log('postID', args.id);
      console.log('userID', user.id);

      const post = await postModel.findOneAndUpdate(
        {_id: args.id, user: user.id},
        args.post,
        {new: true}
      );
      console.log(post);

      return post;
    },
    deletePost: async (_parent: unknown, args: Post, user: UserIdWithToken) => {
      console.log('deletePost');

      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const post = await postModel.findOneAndDelete({
        _id: args.id,
        user: user.id,
      });
      return post;
    },
    deletePostAsAdmin: async (
      _parent: unknown,
      args: Post,
      user: UserIdWithToken
    ) => {
      console.log('deleteAsAdmin');

      if (!user.token || user.role !== 'admin') {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      const post = await postModel.findByIdAndDelete(args.id);
      return post;
    },
    updatePostAsAdmin: async (
      _parent: unknown,
      args: {id: string; post: Post},
      user: UserIdWithToken
    ) => {
      if (!user.token || user.role !== 'admin') {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const post = await postModel.findByIdAndUpdate(args.id, args.post, {
        new: true,
      });
      return post;
    },
  },
};
