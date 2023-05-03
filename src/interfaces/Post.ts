import {Types, Document} from 'mongoose';
import {User} from './User';

interface Post extends Document {
  text: string;
  user: Types.ObjectId | User;
  likes: number;
  image: string;
  dateAdded: Date;
}

interface PostTest {
  id?: string;
  text?: string;
  user?: Types.ObjectId | User;
  likes?: number;
  image?: string;
  dateAdded?: Date;
}

export {Post, PostTest};
