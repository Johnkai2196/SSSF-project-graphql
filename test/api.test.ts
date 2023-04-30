import mongoose from 'mongoose';
import {UserTest} from '../src/interfaces/User';
import {deleteUser, getUser, getUsers, login, register} from './userFunctions';
import app from '../src/app';
import LoginMessageResponse from '../src/interfaces/LoginMessageResponse';
import jwt from 'jsonwebtoken';

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
let userData: LoginMessageResponse;
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
  // login user
  it('login user', async () => {
    userData = await login(app, testUser);
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
  //test delete user
  it('delete current user', async () => {
    await deleteUser(app, userData.token!);
  });
});
