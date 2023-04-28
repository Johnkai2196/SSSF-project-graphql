import {Types, Document} from 'mongoose';
import {User} from './User';

interface Post extends Document {
  text: string;
  user: Types.ObjectId | User;
  likes: Types.ObjectId[] | User[];
  image: string;
  group: Types.ObjectId;
}

export {Post};
