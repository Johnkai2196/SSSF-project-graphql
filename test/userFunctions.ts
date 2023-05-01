//get user from grapql query users test

import randomstring from 'randomstring';
import ErrorResponse from '../src/interfaces/ErrorResponse';
import LoginMessageResponse from '../src/interfaces/LoginMessageResponse';
import {UserTest} from '../src/interfaces/User';
// eslint-disable-next-line node/no-unpublished-import
import request from 'supertest';
// get user from graphql query users

/*query Query($userByIdId: ID!) {
  userById(id: $userByIdId) {
    id
    user_name
    email
    profilePicture
    bannerPicture
    bio
  }
} */
const getUser = (url: string | Function, id: string): Promise<UserTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query Query($userByIdId: ID!) {
            userById(id: $userByIdId) {
                id
                user_name
                email
                profilePicture
                bannerPicture
                bio
            }
            }`,
        variables: {userByIdId: id},
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const user = response.body.data.userById;
          expect(user).toHaveProperty('id');
          expect(user).toHaveProperty('user_name');
          expect(user).toHaveProperty('email');
          expect(user).toHaveProperty('profilePicture');
          expect(user).toHaveProperty('bannerPicture');
          expect(user).not.toHaveProperty('password');
          resolve(response.body.data.userById);
        }
      });
  });
};

// test for graphql query users
/*query Query {
  users {
    id
    user_name
    email
    profilePicture
    bannerPicture
    bio
  }
} */
const getUsers = (url: string | Function): Promise<UserTest[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: '{users{id user_name email profilePicture bannerPicture bio}}',
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const users = response.body.data.users;
          expect(users).toBeInstanceOf(Array);
          expect(users[0]).toHaveProperty('id');
          expect(users[0]).toHaveProperty('user_name');
          expect(users[0]).toHaveProperty('email');
          expect(users[0]).toHaveProperty('profilePicture');
          expect(users[0]).toHaveProperty('bannerPicture');
          expect(users[0]).not.toHaveProperty('password');
          resolve(response.body.data.users);
        }
      });
  });
};

/*query Query($userByIdId: ID!) {
  userById(id: $userByIdId) {
    id
    user_name
    email
    profilePicture
    bannerPicture
    bio
  }
} */
const getUserById = (url: string | Function, id: string): Promise<UserTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query Query($userByIdId: ID!) {
            userById(id: $userByIdId) {
                id
                user_name
                email
                profilePicture
                bannerPicture
                bio
            }
            }`,
        variables: {userByIdId: id},
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const user = response.body.data.userById;
          expect(user).toHaveProperty('id');
          expect(user).toHaveProperty('user_name');
          expect(user).toHaveProperty('email');
          expect(user).toHaveProperty('profilePicture');
          expect(user).toHaveProperty('bannerPicture');
          expect(user).toHaveProperty('bio');
          expect(user).not.toHaveProperty('password');
          resolve(response.body.data.userById);
        }
      });
  });
};
/*mutation Mutation($credentials: Credentials!) {
  login(credentials: $credentials) {
    token
    message
    user {
      id
      user_name
      email
      profilePicture
      bannerPicture
      bio
    }
  }
} */
const login = (
  url: string | Function,
  user: UserTest
): Promise<LoginMessageResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `mutation Mutation($credentials: Credentials!) {
            login(credentials: $credentials) {
                token
                message
                user {
                    id
                    user_name
                    email
                    profilePicture
                    bannerPicture
                    bio
                }
            }
            }`,
        variables: {
          credentials: {username: user.user_name, password: user.password},
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const loginMessageResponse = response.body.data.login;
          expect(loginMessageResponse).toHaveProperty('token');
          expect(loginMessageResponse).toHaveProperty('message');
          expect(loginMessageResponse).toHaveProperty('user');
          expect(loginMessageResponse.user).toHaveProperty('id');
          expect(loginMessageResponse.user).toHaveProperty('user_name');
          expect(loginMessageResponse.user).toHaveProperty('email');
          expect(loginMessageResponse.user).toHaveProperty('profilePicture');
          expect(loginMessageResponse.user).toHaveProperty('bannerPicture');
          expect(loginMessageResponse.user).toHaveProperty('bio');
          expect(loginMessageResponse.user).not.toHaveProperty('password');
          resolve(loginMessageResponse);
        }
      });
  });
};

/* mutation Register($user: UserInput!) {
  register(user: $user) {
    message
    user {
      id
      user_name
      email
      bannerPicture
      bio
      profilePicture
    }
  }
}*/
const register = (
  url: string | Function,
  user: UserTest
): Promise<UserTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `mutation Register($user: UserInput!) {
            register(user: $user) {
                message
                user {
                    id
                    user_name
                    email
                    bannerPicture
                    bio
                    profilePicture
                }
            }
            }`,
        variables: {
          user: {
            user_name: user.user_name,
            email: user.email,
            password: user.password,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const registerMessageResponse = response.body.data.register;
          expect(registerMessageResponse).toHaveProperty('message');
          expect(registerMessageResponse).toHaveProperty('user');
          expect(registerMessageResponse.user).toHaveProperty('id');
          expect(registerMessageResponse.user).toHaveProperty('user_name');
          expect(registerMessageResponse.user).toHaveProperty('email');
          expect(registerMessageResponse.user).toHaveProperty('profilePicture');
          expect(registerMessageResponse.user).toHaveProperty('bannerPicture');
          expect(registerMessageResponse.user).toHaveProperty('bio');
          expect(registerMessageResponse.user).not.toHaveProperty('password');
          resolve(registerMessageResponse.user);
        }
      });
  });
};

/*mutation DeleteUser {
  deleteUser {
    message
    user {
      id
      user_name
      email
      profilePicture
      bannerPicture
      bio
    }
    token
  }
} */
const deleteUser = (
  url: string | Function,
  token: string
): Promise<ErrorResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation DeleteUser {
            deleteUser {
                message
                user {
                    id
                    user_name
                    email
                    profilePicture
                    bannerPicture
                    bio
                }
                token
            }
            }`,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const deleteMessageResponse = response.body.data.deleteUser;
          expect(deleteMessageResponse).toHaveProperty('message');
          expect(deleteMessageResponse).toHaveProperty('user');
          expect(deleteMessageResponse.user).toHaveProperty('id');
          expect(deleteMessageResponse.user).toHaveProperty('user_name');
          expect(deleteMessageResponse.user).toHaveProperty('email');
          expect(deleteMessageResponse.user).toHaveProperty('profilePicture');
          expect(deleteMessageResponse.user).toHaveProperty('bannerPicture');
          expect(deleteMessageResponse.user).toHaveProperty('bio');
          expect(deleteMessageResponse.user).not.toHaveProperty('password');
          resolve(response.body.data.deleteUser);
        }
      });
  });
};
/*mutation Mutation($user: UserModify!) {
  updateUser(user: $user) {
    token
    message
    user {
      id
      user_name
      email
      profilePicture
      bannerPicture
      bio
    }
  }
}*/
const updateUser = (
  url: string | Function,
  token: string
): Promise<LoginMessageResponse> => {
  return new Promise((resolve, reject) => {
    const newValue = 'Test Monkey ' + randomstring.generate(7);
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation Mutation($user: UserModify!) {
            updateUser(user: $user) {
                token
                message
                user {
                    id
                    user_name
                    email
                    profilePicture
                    bannerPicture
                    bio
                }
            }
            }`,
        variables: {
          user: {
            user_name: newValue,
            email: newValue + '@test.com',
            bio: newValue,
            profilePicture: newValue,
            bannerPicture: newValue,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const updateMessageResponse = response.body.data.updateUser;
          expect(updateMessageResponse).toHaveProperty('message');
          expect(updateMessageResponse).toHaveProperty('user');
          expect(updateMessageResponse.user).toHaveProperty('id');
          expect(updateMessageResponse.user.user_name).toBe(newValue);
          expect(updateMessageResponse.user.email).toBe(newValue + '@test.com');
          expect(updateMessageResponse.user.bio).toBe(newValue);
          expect(updateMessageResponse.user.profilePicture).toBe(newValue);
          expect(updateMessageResponse.user.bannerPicture).toBe(newValue);
          resolve(updateMessageResponse);
        }
      });
  });
};
/* mutation Register($user: UserInput!) {
  register(user: $user) {
    message
    user {
      id
      user_name
      email
      bannerPicture
      bio
      profilePicture
    }
  }
}*/
const duplicateRegister = (
  url: string | Function,
  user: UserTest
): Promise<ErrorResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `mutation Register($user: UserInput!) {
            register(user: $user) {
                message
                user {
                    id
                    user_name
                    email
                    bannerPicture
                    bio
                    profilePicture
                }
            }
            }`,
        variables: {
          user: {
            user_name: user.user_name,
            email: user.email,
            password: user.password,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const registerMessageResponse = response.body.data.register;
          expect(registerMessageResponse).toBe(null);
          resolve(registerMessageResponse);
        }
      });
  });
};
/*mutation DeleteUserAsAdmin($deleteUserAsAdminId: ID!) {
  deleteUserAsAdmin(id: $deleteUserAsAdminId) {
    message
    user {
      id
    }
  }
}*/
const deleteUserAsAdmin = (
  url: string | Function,
  id: string,
  token: string
): Promise<ErrorResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation DeleteUserAsAdmin($deleteUserAsAdminId: ID!) {
          deleteUserAsAdmin(id: $deleteUserAsAdminId) {
            user {
              id
            }
          }
        }`,
        variables: {
          deleteUserAsAdminId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const userData = response.body.data.deleteUserAsAdmin;
          expect(userData.user.id).toBe(id);
          resolve(response.body.data.deleteUser);
        }
      });
  });
};
/*mutation Mutation($updateUserAsAdminId: ID!, $user: UserModify!) {
  updateUserAsAdmin(id: $updateUserAsAdminId, user: $user) {
    token
    message
    user {
      id
      user_name
      email
      profilePicture
      bannerPicture
      bio
    }
  }
} */
const updateUserAsAdmin = (
  url: string | Function,
  id: string,
  token: string
): Promise<LoginMessageResponse> => {
  return new Promise((resolve, reject) => {
    const newValue = 'Test Monkey ' + randomstring.generate(7);
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation Mutation($updateUserAsAdminId: ID!, $user: UserModify!) {
            updateUserAsAdmin(id: $updateUserAsAdminId, user: $user) {
                token
                message
                user {
                    id
                    user_name
                    email
                    profilePicture
                    bannerPicture
                    bio
                }
            }
            }`,
        variables: {
          updateUserAsAdminId: id,
          user: {
            user_name: newValue,
            email: newValue + '@test.com',
            bio: newValue,
            profilePicture: newValue,
            bannerPicture: newValue,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const updateMessageResponse = response.body.data.updateUserAsAdmin;
          expect(updateMessageResponse).toHaveProperty('message');
          expect(updateMessageResponse).toHaveProperty('user');
          expect(updateMessageResponse.user).toHaveProperty('id');
          expect(updateMessageResponse.user.user_name).toBe(newValue);
          expect(updateMessageResponse.user.email).toBe(newValue + '@test.com');
          expect(updateMessageResponse.user.bio).toBe(newValue);
          expect(updateMessageResponse.user.profilePicture).toBe(newValue);
          expect(updateMessageResponse.user.bannerPicture).toBe(newValue);
          resolve(updateMessageResponse);
        }
      });
  });
};

export {
  getUser,
  getUsers,
  getUserById,
  login,
  register,
  deleteUser,
  updateUser,
  duplicateRegister,
  deleteUserAsAdmin,
  updateUserAsAdmin,
};
