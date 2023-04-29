import {Post} from '../../interfaces/Post';
import {UserIdWithToken} from '../../interfaces/User';
import postModel from '../models/postModel';
import {GraphQLError} from 'graphql';
import {Types} from 'mongoose';
export default {
  Query: {
    posts: async () => {
      console.log('posts');
      const posts = await postModel.find();
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
  },
};
