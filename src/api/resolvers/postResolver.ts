import {Post} from '../../interfaces/Post';
import {UserIdWithToken} from '../../interfaces/User';
import postModel from '../models/postModel';
import {GraphQLError} from 'graphql';
import {Types} from 'mongoose';
export default {
  Query: {
    //get all posts
    posts: async () => {
      console.log('posts');
      const posts = await postModel.find();
      return posts;
    },
    //get post by id
    postById: async (_parent: unknown, args: Post) => {
      console.log('postById');
      const post = await postModel.findById(args.id);
      return post;
    },
    //get posts by user
    postsByUser: async (
      _parent: unknown,
      args: Post,
      user: UserIdWithToken
    ) => {
      console.log('postsByUser');
      const posts = await postModel.find({user: user.id});
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
      const post = new postModel(args);
      return await post.save();
    },

    updatePost: async (_parent: unknown, args: Post, user: UserIdWithToken) => {
      console.log('updatePost');

      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      console.log(args.id);
      console.log(user.id);

      const post = await postModel.findOneAndUpdate(
        {_id: args.id, user: user.id},
        args
      );
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
        id: args._id,
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
      args: Post,
      user: UserIdWithToken
    ) => {
      console.log('updateAsAdmin');

      if (!user.token || user.role !== 'admin') {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const post = await postModel.findByIdAndUpdate(args._id);
      return post;
    },
  },
};
