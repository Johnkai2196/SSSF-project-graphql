import {UserIdWithToken} from '../../interfaces/User';
import likeModel from '../models/likeModel';
import {Types} from 'mongoose';
import {GraphQLError} from 'graphql';
import {Post} from '../../interfaces/Post';
import {Like} from '../../interfaces/Like';

export default {
  Query: {
    likes: async () => {
      const likes = await likeModel.find();
      return likes;
    },
    likeById: async (_parent: unknown, args: Like) => {
      const like = await likeModel.findById(args.id);
      return like;
    },
  },
  Mutation: {
    createLike: async (_parent: unknown, args: Post, user: UserIdWithToken) => {
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      args.user = user.id as unknown as Types.ObjectId;
      console.log('args', args);

      const like = new likeModel(args);
      console.log('like', like);

      return await like.save();
    },
    deleteLike: async (_parent: unknown, args: Post, user: UserIdWithToken) => {
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      console.log('args', args.id);
      console.log('user', user.id);

      return await likeModel.findOneAndDelete({post: args.id, user: user.id});
    },
  },
};
