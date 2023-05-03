import {Types} from 'mongoose';
import {Post} from './Post';
import {User} from './User';

interface Like extends Document {
  id: Types.ObjectId;
  user: Types.ObjectId | User;
  post: Types.ObjectId | Post;
}
interface LikeTest {
  id?: Types.ObjectId;
  user?: Types.ObjectId | User;
  post?: Types.ObjectId | Post;
}

export {Like, LikeTest};
