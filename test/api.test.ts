import mongoose from 'mongoose';
import {UserTest} from '../src/interfaces/User';
import {
  getUsers,
  getUserById,
  login,
  register,
  deleteUser,
  updateUser,
  duplicateRegister,
  deleteUserAsAdmin,
  updateUserAsAdmin,
  checkToken,
} from './userFunctions';
import app from '../src/app';
import LoginMessageResponse from '../src/interfaces/LoginMessageResponse';
import jwt from 'jsonwebtoken';
import {PostTest} from '../src/interfaces/Post';
import {
  postFile,
  createPost,
  createPostWithoutImage,
  updatePostText,
  updatePostImage,
  wrongUserUpdatePost,
  deletePost,
  wrongUserDeletePost,
  deletePostAsAdmin,
  notAdminDeletePost,
  notAdminUpdatePost,
  updatePostImageAsAdmin,
  updatePostTextAsAdmin,
  updatePostTextAndImageAsAdmin,
  updatePostTextAndImage,
  getPosts,
  getPostById,
  getPostsByUser,
} from './postFunction';
import {
  getLikes,
  getLikeById,
  createLike,
  deleteLike,
  createLikeFail,
} from './likeFunction';
import {LikeTest} from '../src/interfaces/Like';

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
  it('should fail register user same username', async () => {
    await duplicateRegister(app, testUserName);
  });
  // test should fail register user same email
  it('should fail register user same email', async () => {
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
  it('get user by id', async () => {
    await getUserById(app, userData.user.id);
  });
  // test check token
  it('check token', async () => {
    await checkToken(app, userData.token!);
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
  let postData2: PostTest;
  let postID: string;
  let postID2: string;
  let likeID: string;
  let likeData: LikeTest;
  // test upload file
  it('upload file', async () => {
    await postFile(uploadApp, userData.token!);
  });
  // test create post
  it('create post', async () => {
    postData = await createPost(app, postData, userData.token!);
    postID = postData.id!;
  });
  // test create like
  it('create like', async () => {
    likeData = await createLike(app, postID, userData.token!);
    likeID = likeData.id!.toString();
  });
  // test create like fail
  it('create like fail', async () => {
    await createLikeFail(app, postID, userData.token!);
  });
  // test get likes
  it('get likes', async () => {
    await getLikes(app);
  });
  // test get like by id
  it('get like by id', async () => {
    await getLikeById(app, likeID);
  });
  // test delete like
  it('delete like', async () => {
    await deleteLike(app, postID, userData.token!);
  });
  //test create post without image
  it('create post without image', async () => {
    postData2 = await createPostWithoutImage(
      app,
      {text: 'test'},
      userData2.token!
    );
    postID2 = postData2.id!;
  });
  // test update post text
  it('update post text', async () => {
    await updatePostText(app, {text: 'newText'}, postID, userData.token!);
  });
  // test update post image
  it('update post image', async () => {
    await updatePostImage(app, {image: 'newImage'}, postID, userData.token!);
  });
  // test update post text and image
  it('update post', async () => {
    await updatePostTextAndImage(
      app,
      {text: 'newText2', image: 'newImage2'},
      postID,
      userData.token!
    );
  });

  // test update post image as admin
  it('update post image as admin', async () => {
    await updatePostImageAsAdmin(
      app,
      {image: 'newImageAdmin'},
      postID,
      adminData.token!
    );
  });
  // test update post text as admin
  it('update post text as admin', async () => {
    await updatePostTextAsAdmin(
      app,
      {text: 'newTextAdmin'},
      postID,
      adminData.token!
    );
  });
  // test update post text and image as admin
  it('update post as admin', async () => {
    await updatePostTextAndImageAsAdmin(
      app,
      {text: 'newTextAdmin', image: 'newImageAdmin'},
      postID,
      adminData.token!
    );
  });
  // test not admin update post
  it('not admin update post', async () => {
    await notAdminUpdatePost(
      app,
      {text: 'newTextAdmin', image: 'newImageAdmin'},
      postID,
      userData.token!
    );
  });
  // should get all posts
  it('get all posts', async () => {
    await getPosts(app);
  });
  // should get post by id
  it('get post by id', async () => {
    await getPostById(app, postID);
  });
  // should get post by user id
  it('get post by user id', async () => {
    await getPostsByUser(app, userData.user.id);
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
  // test not admin delete post
  it('not admin delete post', async () => {
    await notAdminDeletePost(app, postID, userData.token!);
  });

  // test delete post
  it('delete post', async () => {
    await deletePost(app, postID, userData.token!);
  });
  // test delete post as admin
  it('delete post as admin', async () => {
    await deletePostAsAdmin(app, postID2, adminData.token!);
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
