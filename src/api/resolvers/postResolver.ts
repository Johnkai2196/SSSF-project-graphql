import postModel from '../models/postModel';

export default {
  Query: {
    posts: async () => {
      console.log('posts');
      const posts = await postModel.find();
      return posts;
    },
  },
};
