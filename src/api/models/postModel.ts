import {Post} from '../../interfaces/Post';
import mongoose from 'mongoose';
const postModel = new mongoose.Schema<Post>({
  text: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image: {
    type: String,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model<Post>('Post', postModel);
