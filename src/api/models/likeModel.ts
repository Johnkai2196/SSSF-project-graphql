import mongoose from 'mongoose';
import {Like} from '../../interfaces/Like';

const likeModel = new mongoose.Schema<Like>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
});

export default mongoose.model<Like>('Like', likeModel);
