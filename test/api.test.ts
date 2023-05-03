import mongoose from 'mongoose';
import {UserTest} from '../src/interfaces/User';
import {
  deleteUser,
  deleteUserAsAdmin,
  duplicateRegister,
  getUser,
  getUsers,
  login,
  register,
  updateUser,
  updateUserAsAdmin,
} from './userFunctions';
import app from '../src/app';
import LoginMessageResponse from '../src/interfaces/LoginMessageResponse';
import jwt from 'jsonwebtoken';
import {PostTest} from '../src/interfaces/Post';
import {
  createPost,
  createPostWithoutImage,
  deletePost,
  postFile,
  updatePostImage,
  updatePostText,
  wrongUserDeletePost,
  wrongUserUpdatePost,
} from './postFunction';

const uploadApp = process.env.UPLOAD_URL as string;
const adminUser: UserTest = {
  user_name: 'admin',
  password: '12345',
};
const testUser: UserTest = {
  user_name: 'John Doe',
  email: 'JohnDoe@gmail.com',
  password: '12345',
};
const testEmail: UserTest = {
  user_name: 'John1 Doe',
  email: 'JohnDoe@gmail.com',
  password: '12345',
};
const testUserName: UserTest = {
  user_name: 'John Doe',
  email: 'JohnDoe1@gmail.com',
  password: '12345',
};
const testUser2: UserTest = {
  user_name: 'John Doe2',
  email: 'JohnDoe2@gmail.com',
  password: '12345',
};
let userData: LoginMessageResponse;
let userData2: LoginMessageResponse;
let adminData: LoginMessageResponse;
describe('Testing graphql api', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL as string);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
  // register user
  it('register user', async () => {
    await register(app, testUser);
  });
  // second user register
  it('second user register', async () => {
    await register(app, testUser2);
  });
  // test should fail register user same username
  it('should fail register user', async () => {
    await duplicateRegister(app, testUserName);
  });
  // test should fail register user same email
  it('should fail register user', async () => {
    await duplicateRegister(app, testEmail);
  });
  // login user
  it('login user', async () => {
    userData = await login(app, testUser);
  });
  // login second user
  it('login second user', async () => {
    userData2 = await login(app, testUser2);
  });
  // login admin
  it('login admin', async () => {
    adminData = await login(app, adminUser);
  });
  it('token should have role', async () => {
    const dataFromToken = jwt.verify(
      userData.token!,
      process.env.JWT_SECRET as string
    );
    expect(dataFromToken).toHaveProperty('role');
  });
  // test get users
  it('get users', async () => {
    await getUsers(app);
  });
  // test get user
  it('get user', async () => {
    await getUser(app, userData.user.id);
  });
  // test update user
  it('update user', async () => {
    await updateUser(app, userData.token!);
  });
  // test post
  let postData: PostTest = {
    text: 'test',
    image: 'test',
  };
  let postID: string;
  // test upload file
  it('upload file', async () => {
    await postFile(uploadApp, userData.token!);
  });
  // test create post
  it('create post', async () => {
    postData = await createPost(app, postData, userData.token!);
    postID = postData.id!;
  });
  //test create post without image
  it('create post without image', async () => {
    await createPostWithoutImage(app, {text: 'test'}, userData.token!);
  });
  // test update post text
  it('update post', async () => {
    await updatePostText(app, {text: 'newText'}, postID, userData.token!);
  });
  // test update post image
  it('update post image', async () => {
    await updatePostImage(app, {image: 'newImage'}, postID, userData.token!);
  });
  //test wrong user update post
  it('wrong user update post', async () => {
    await wrongUserUpdatePost(
      app,
      {text: 'newText2'},
      postID,
      userData2.token!
    );
  });
  // test wrong user delete post
  it('wrong user delete post', async () => {
    await wrongUserDeletePost(app, postID, userData2.token!);
  });
  // test delete post
  it('delete post', async () => {
    await deletePost(app, postID, userData.token!);
  });
  //test delete user
  it('delete current user', async () => {
    await deleteUser(app, userData.token!);
  });
  //test update user as admin
  it('update user as admin', async () => {
    await updateUserAsAdmin(app, userData2.user.id, adminData.token!);
  });
  // test delete user as admin
  it('delete user as admin', async () => {
    await deleteUserAsAdmin(app, userData2.user.id, adminData.token!);
  });
});
