import {GraphQLError} from 'graphql';
import {User, UserIdWithToken} from '../../interfaces/User';
import LoginMessageResponse from '../../interfaces/LoginMessageResponse';
import {Post} from '../../interfaces/Post';
import postModel from '../models/postModel';
import likeModel from '../models/likeModel';

export default {
  Post: {
    user: async (parent: Post) => {
      const response = await fetch(
        `${process.env.AUTH_URL}/users/${parent.user}`
      );
      if (!response.ok) {
        throw new GraphQLError(response.statusText, {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      const user = (await response.json()) as User;
      return user;
    },
  },
  Like: {
    user: async (parent: Post) => {
      const response = await fetch(
        `${process.env.AUTH_URL}/users/${parent.user}`
      );
      if (!response.ok) {
        throw new GraphQLError(response.statusText, {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      const user = (await response.json()) as User;
      return user;
    },
  },
  // 1. Queries
  Query: {
    // 1.1. Get all users
    users: async () => {
      const response = await fetch(`${process.env.AUTH_URL}/users`);
      if (!response.ok) {
        throw new GraphQLError(response.statusText, {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      const users = (await response.json()) as User[];
      return users;
    },
    // 1.2. Get a user by id
    userById: async (_parent: unknown, args: {id: string}) => {
      const response = await fetch(`${process.env.AUTH_URL}/users/${args.id}`);
      if (!response.ok) {
        throw new GraphQLError(response.statusText, {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      const user = (await response.json()) as User;
      return user;
    },
    // 1.3. check token
    checkToken: async (
      _parent: unknown,
      _args: unknown,
      user: UserIdWithToken
    ) => {
      const response = await fetch(`${process.env.AUTH_URL}/users/token`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!response.ok) {
        throw new GraphQLError(response.statusText, {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      const userFromAuth = await response.json();
      return userFromAuth;
    },
  },
  // 2. Mutations
  Mutation: {
    // 2.1. Register a user
    register: async (_parent: unknown, args: {user: User}) => {
      const response = await fetch(`${process.env.AUTH_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args.user),
      });

      if (!response.ok) {
        throw new GraphQLError(response.statusText, {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      const user = (await response.json()) as LoginMessageResponse;
      return user;
    },
    // 2.2 Login a user
    login: async (
      _parent: unknown,
      args: {credentials: {username: string; password: string}}
    ) => {
      const response = await fetch(`${process.env.AUTH_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args.credentials),
      });
      if (!response.ok) {
        throw new GraphQLError(response.statusText, {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      const user = (await response.json()) as LoginMessageResponse;

      return user;
    },
    // 2.3. Update a user
    updateUser: async (
      _parent: unknown,
      args: {user: User},
      user: UserIdWithToken
    ) => {
      if (!user.token) {
        throw new GraphQLError('Unauthorized', {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }
      const response = await fetch(`${process.env.AUTH_URL}/users/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(args.user),
      });
      if (!response.ok) {
        throw new GraphQLError(response.statusText, {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      const userUpdated = (await response.json()) as LoginMessageResponse;
      return userUpdated;
    },
    // 2.4. Delete a user
    deleteUser: async (
      _parent: unknown,
      args: unknown,
      user: UserIdWithToken
    ) => {
      if (!user.token) {
        throw new GraphQLError('Unauthorized', {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }
      await likeModel.deleteMany({
        user: user.id,
      });
      await postModel.deleteMany({
        user: user.id,
      });
      const response = await fetch(`${process.env.AUTH_URL}/users`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(args),
      });
      if (!response.ok) {
        throw new GraphQLError(response.statusText, {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      const userDeleted = (await response.json()) as LoginMessageResponse;
      return userDeleted;
    },
    // 2.5. Delete a user as admin
    deleteUserAsAdmin: async (
      _parent: unknown,
      args: {id: string},
      user: UserIdWithToken
    ) => {
      if (!user.token || user.role !== 'admin') {
        throw new GraphQLError('Unauthorized', {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      await likeModel.deleteMany({
        user: args.id,
      });
      await postModel.deleteMany({
        user: args.id,
      });
      const response = await fetch(`${process.env.AUTH_URL}/users/${args.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(args),
      });
      if (!response.ok) {
        throw new GraphQLError(response.statusText, {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      const userDeleted = (await response.json()) as LoginMessageResponse;
      return userDeleted;
    },
    // 2.6. Update a user as admin
    updateUserAsAdmin: async (
      _parent: unknown,
      args: User,
      user: UserIdWithToken
    ) => {
      if (!user.token || user.role !== 'admin') {
        throw new GraphQLError('Unauthorized', {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      const response = await fetch(`${process.env.AUTH_URL}/users/${args.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(args),
      });
      if (!response.ok) {
        throw new GraphQLError(response.statusText, {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }

      const userUpdated = (await response.json()) as LoginMessageResponse;
      return userUpdated;
    },
  },
};
