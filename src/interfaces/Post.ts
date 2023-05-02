import {Types, Document} from 'mongoose';
import {User} from './User';
import {Like} from './Like';

interface Post extends Document {
  text: string;
  user: Types.ObjectId | User;
  likes: number;
  image: string;
  group: Types.ObjectId;
  dateAdded: Date;
}

export {Post};
