import {Types, Document} from 'mongoose';
import {User} from './User';
import {Like} from './Like';

interface Post extends Document {
  text: string;
  user: Types.ObjectId | User;
  likes: Types.ObjectId[] | Like[];
  image: string;
  dateAdded: Date;
}

interface PostTest {
  id?: string;
  text?: string;
  user?: Types.ObjectId | User;
  likes?: Types.ObjectId[] | Like[];
  image?: string;
  dateAdded?: Date;
}

export {Post, PostTest};
