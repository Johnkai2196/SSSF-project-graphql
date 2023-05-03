/* eslint-disable node/no-unpublished-import */
import request from 'supertest';
import expect from 'expect';
import UploadMessageResponse from '../src/interfaces/UploadMessageResponse';
import {PostTest} from '../src/interfaces/Post';
require('dotenv').config();

// add test for graphql query
const postFile = (
  url: string | Function,
  token: string
): Promise<UploadMessageResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/uploadimage')
      .set('Authorization', `Bearer ${token}`)
      .attach('picture', 'test/_X7A8141.JPG')
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const uploadMessageResponse = response.body;
          expect(uploadMessageResponse).toHaveProperty('message');
          expect(uploadMessageResponse).toHaveProperty('data');
          expect(uploadMessageResponse.data).toHaveProperty('filename');
          resolve(uploadMessageResponse);
        }
      });
  });
};
/*mutation CreatePost($text: String!, $image: String) {
  createPost(text: $text, image: $image) {
    id
    user {
      id
      user_name
      email
      profilePicture
      bannerPicture
      bio
    }
    image
    dateAdded
    text
  }
} */
const createPost = (
  url: string | Function,
  post: PostTest,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation CreatePost($text: String!, $image: String) {
                        createPost(text: $text, image: $image) {
                            id
                            user {
                                id
                                user_name
                                email
                                profilePicture
                                bannerPicture
                                bio
                            }
                            image
                            dateAdded
                            text
                        }
                    }`,
        variables: post,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const postResponse = response.body.data.createPost;
          expect(postResponse).toHaveProperty('id');
          expect(postResponse.user).toHaveProperty('user_name');
          expect(postResponse).toHaveProperty('image');
          expect(postResponse).toHaveProperty('dateAdded');
          expect(postResponse).toHaveProperty('text');
          expect(postResponse.text).toBe(post.text);
          expect(postResponse.image).toBe(post.image);
          resolve(postResponse);
        }
      });
  });
};
/*mutation CreatePost($text: String!) {
  createPost(text: $text) {
    id
    user {
      id
      user_name
      email
      profilePicture
      bannerPicture
      bio
    }
    image
    dateAdded
    text
  }
} */
const createPostWithoutImage = (
  url: string | Function,
  post: PostTest,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation CreatePost($text: String!) {
                        createPost(text: $text) {
                            id
                            user {
                                id
                                user_name
                                email
                                profilePicture
                                bannerPicture
                                bio
                            }
                            dateAdded
                            text
                        }
                    }`,
        variables: post,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const postResponse = response.body.data.createPost;
          expect(postResponse).toHaveProperty('id');
          expect(postResponse.user).toHaveProperty('user_name');
          expect(postResponse).toHaveProperty('dateAdded');
          expect(postResponse).toHaveProperty('text');
          expect(postResponse.text).toBe(post.text);
          resolve(postResponse);
        }
      });
  });
};

/*mutation Mutation($updatePostId: ID!, $post: PostModify!) {
  updatePost(id: $updatePostId, post: $post) {
    dateAdded
    text
    id
    user {
      id
      user_name
      email
      profilePicture
      bannerPicture
      bio
    }
    image
  }
}*/
const updatePostText = (
  url: string | Function,
  post: PostTest,
  id: string,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation Mutation($updatePostId: ID!, $post: PostModify!) {
                        updatePost(id: $updatePostId, post: $post) {
                            dateAdded
                            text
                            id
                            user {
                                id
                                user_name
                                email
                                profilePicture
                                bannerPicture
                                bio
                            }
                            image
                        }
                    }`,
        variables: {post, updatePostId: id},
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const postResponse = response.body.data.updatePost;
          expect(postResponse).toHaveProperty('id');
          expect(postResponse.user).toHaveProperty('user_name');
          expect(postResponse).toHaveProperty('dateAdded');
          expect(postResponse).toHaveProperty('text');
          expect(postResponse.text).toBe(post.text);
          resolve(postResponse);
        }
      });
  });
};
const updatePostImage = (
  url: string | Function,
  post: PostTest,
  id: string,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation Mutation($updatePostId: ID!, $post: PostModify!) {
                        updatePost(id: $updatePostId, post: $post) {
                            dateAdded
                            text
                            id
                            user {
                                id
                                user_name
                                email
                                profilePicture
                                bannerPicture
                                bio
                            }
                            image
                        }
                    }`,
        variables: {post, updatePostId: id},
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const postResponse = response.body.data.updatePost;
          expect(postResponse).toHaveProperty('id');
          expect(postResponse.user).toHaveProperty('user_name');
          expect(postResponse).toHaveProperty('dateAdded');
          expect(postResponse).toHaveProperty('image');
          expect(postResponse.image).toBe(post.image);
          resolve(postResponse);
        }
      });
  });
};
const updatePostTextAndImage = (
  url: string | Function,
  post: PostTest,
  id: string,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation Mutation($updatePostId: ID!, $post: PostModify!) {
                        updatePost(id: $updatePostId, post: $post) {
                            dateAdded
                            text
                            id
                            user {
                                id
                                user_name
                                email
                                profilePicture
                                bannerPicture
                                bio
                            }
                            image
                        }
                    }`,
        variables: {post, updatePostId: id},
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const postResponse = response.body.data.updatePost;
          expect(postResponse).toHaveProperty('id');
          expect(postResponse.user).toHaveProperty('user_name');
          expect(postResponse).toHaveProperty('dateAdded');
          expect(postResponse).toHaveProperty('text');
          expect(postResponse).toHaveProperty('image');
          expect(postResponse.text).toBe(post.text);
          expect(postResponse.image).toBe(post.image);
          resolve(postResponse);
        }
      });
  });
};

const wrongUserUpdatePost = (
  url: string | Function,
  post: PostTest,
  id: string,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation Mutation($updatePostId: ID!, $post: PostModify!) {
                            updatePost(id: $updatePostId, post: $post) {
                                dateAdded
                                text
                                id
                                user {
                                    id
                                    user_name
                                    email
                                    profilePicture
                                    bannerPicture
                                    bio
                                }
                                image
                            }
                        }`,
        variables: {post, updatePostId: id},
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const postResponse = response.body.data.updatePost;
          expect(postResponse).toBeNull();
          resolve(postResponse);
        }
      });
  });
};
/*mutation UpdatePostAsAdmin($updatePostAsAdminId: ID!, $post: PostModify!) {
  updatePostAsAdmin(id: $updatePostAsAdminId, post: $post) {
    id
    text
    user {
      id
      user_name
      email
      profilePicture
      bannerPicture
      bio
    }
    image
    dateAdded
  }
}*/
const updatePostTextAsAdmin = (
  url: string | Function,
  post: PostTest,
  id: string,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation UpdatePostAsAdmin($updatePostAsAdminId: ID!, $post: PostModify!) {
                        updatePostAsAdmin(id: $updatePostAsAdminId, post: $post) {
                            id
                            text
                            user {
                                id
                                user_name
                                email
                                profilePicture
                                bannerPicture
                                bio
                            }
                            image
                            dateAdded
                          }
                        }`,
        variables: {post, updatePostAsAdminId: id},
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const postResponse = response.body.data.updatePostAsAdmin;
          expect(postResponse).toHaveProperty('id');
          expect(postResponse.user).toHaveProperty('user_name');
          expect(postResponse).toHaveProperty('dateAdded');
          expect(postResponse).toHaveProperty('text');
          expect(postResponse.text).toBe(post.text);
          resolve(postResponse);
        }
      });
  });
};

const updatePostImageAsAdmin = (
  url: string | Function,
  post: PostTest,
  id: string,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation UpdatePostAsAdmin($updatePostAsAdminId: ID!, $post: PostModify!) {
                        updatePostAsAdmin(id: $updatePostAsAdminId, post: $post) {
                            id
                            text
                            user {
                                id
                                user_name
                                email
                                profilePicture
                                bannerPicture
                                bio
                            }
                            image
                            dateAdded
                          }
                        }`,
        variables: {post, updatePostAsAdminId: id},
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const postResponse = response.body.data.updatePostAsAdmin;

          expect(postResponse).toHaveProperty('id');
          expect(postResponse.user).toHaveProperty('user_name');
          expect(postResponse).toHaveProperty('dateAdded');
          expect(postResponse).toHaveProperty('image');
          expect(postResponse.image).toBe(post.image);
          resolve(postResponse);
        }
      });
  });
};

const updatePostTextAndImageAsAdmin = (
  url: string | Function,
  post: PostTest,
  id: string,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation UpdatePostAsAdmin($updatePostAsAdminId: ID!, $post: PostModify!) {
                        updatePostAsAdmin(id: $updatePostAsAdminId, post: $post) {
                            id
                            text
                            user {
                                id
                                user_name
                                email
                                profilePicture
                                bannerPicture
                                bio
                            }
                            image
                            dateAdded
                          }
                        }`,
        variables: {post, updatePostAsAdminId: id},
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const postResponse = response.body.data.updatePostAsAdmin;
          expect(postResponse).toHaveProperty('id');
          expect(postResponse.user).toHaveProperty('user_name');
          expect(postResponse).toHaveProperty('dateAdded');
          expect(postResponse).toHaveProperty('image');
          expect(postResponse).toHaveProperty('text');
          expect(postResponse.image).toBe(post.image);
          expect(postResponse.text).toBe(post.text);
          resolve(postResponse);
        }
      });
  });
};
// user not admin cant update post
const notAdminUpdatePost = (
  url: string | Function,
  post: PostTest,
  id: string,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation UpdatePostAsAdmin($updatePostAsAdminId: ID!, $post: PostModify!) {
                        updatePostAsAdmin(id: $updatePostAsAdminId, post: $post) {
                            id
                            text
                            user {
                                id
                                user_name
                                email
                                profilePicture
                                bannerPicture
                                bio
                            }
                            image
                            dateAdded
                          }
                        }`,
        variables: {post, updatePostAsAdminId: id},
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const postResponse = response.body.data.updatePostAsAdmin;
          expect(postResponse).toBe(null);
          resolve(postResponse);
        }
      });
  });
};

/* mutation DeletePost($deletePostId: ID!) {
  deletePost(id: $deletePostId) {
    id
    user {
      user_name
    }
    image
    text
  }
}*/
const deletePost = (
  url: string | Function,
  id: string,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation DeletePost($deletePostId: ID!) {
                        deletePost(id: $deletePostId) {
                            id
                            user {
                                user_name
                            }
                            image
                            text
                        }
                    }`,
        variables: {deletePostId: id},
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const postResponse = response.body.data.deletePost;
          expect(postResponse).toHaveProperty('id');
          expect(postResponse.id).toBe(id);
          expect(postResponse.user).toHaveProperty('user_name');
          expect(postResponse).toHaveProperty('text');
          expect(postResponse).toHaveProperty('image');
          resolve(postResponse);
        }
      });
  });
};
const wrongUserDeletePost = (
  url: string | Function,
  id: string,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation DeletePost($deletePostId: ID!) {
                        deletePost(id: $deletePostId) {
                            id
                            user {
                                user_name
                            }
                            image
                            text
                        }
                    }`,
        variables: {deletePostId: id},
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const postResponse = response.body.data.deletePost;
          expect(postResponse).toBe(null);
          resolve(postResponse);
        }
      });
  });
};
/*mutation DeleteUserAsAdmin($deletePostAsAdminId: ID!) {
  deletePostAsAdmin(id: $deletePostAsAdminId) {
    text
    image
    user {
      user_name
    }
  }
}*/
const deletePostAsAdmin = (
  url: string | Function,
  id: string,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation DeletePostAsAdmin($deletePostAsAdminId: ID!) {
                        deletePostAsAdmin(id: $deletePostAsAdminId) {
                            text
                            image
                            user {
                                user_name
                            }
                        }
                    }`,
        variables: {deletePostAsAdminId: id},
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const postResponse = response.body.data.deletePostAsAdmin;
          console.log('mnon', postResponse);

          expect(postResponse).toHaveProperty('text');
          expect(postResponse).toHaveProperty('image');
          expect(postResponse.user).toHaveProperty('user_name');
          resolve(postResponse);
        }
      });
  });
};
const notAdminDeletePost = (
  url: string | Function,
  id: string,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation DeletePostAsAdmin($deletePostAsAdminId: ID!) {
                        deletePostAsAdmin(id: $deletePostAsAdminId) {
                            text
                            image
                            user {
                                user_name
                            }
                        }
                    }`,
        variables: {deletePostAsAdminId: id},
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const postResponse = response.body.data.deletePostAsAdmin;
          expect(postResponse).toBe(null);
          resolve(postResponse);
        }
      });
  });
};

export {
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
};
