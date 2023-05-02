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
      const newPosts = await Promise.all(
        posts.map(async (post) => {
          console.log('post', post);
          console.log(post.id);

          const likes = await likeModel.find({post: post.id}).populate('user');
          console.log('likes', likes);

          post.likes = likes;
          return post;
        })
      );
      console.log('newPost', newPosts);

      return newPosts;
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

      const post = await postModel.findByIdAndUpdate(
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
