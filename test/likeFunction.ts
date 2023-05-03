/* eslint-disable node/no-unpublished-import */
import request from 'supertest';
import expect from 'expect';
import {LikeTest} from '../src/interfaces/Like';
/* query Likes {
  likes {
    id
    user {
      id
      user_name
    }
    post {
      id
    }
  }
}*/

const getLikes = async (url: string | Function): Promise<LikeTest[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .send({
        query: `query Likes {
        likes {
          id
          user {
            id
            user_name
          }
          post {
            id
          }
        }
      }`,
      })
      .expect(200, (err, res) => {
        if (err) {
          reject(err);
        }
        const likes = res.body.data.likes;
        expect(likes).toBeInstanceOf(Array);
        likes.forEach((like: LikeTest) => {
          expect(like).toHaveProperty('id');
          expect(like).toHaveProperty('user');
          expect(like).toHaveProperty('post');
        });
        resolve(likes);
      });
  });
};

/* query Likes($likeByIdId: ID!) {
  likeById(id: $likeByIdId) {
    id
    user {
      id
      user_name
    }
    post {
      id
    }
  }
}*/
const getLikeById = async (
  url: string | Function,
  id: string
): Promise<LikeTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .send({
        query: `query Likes($likeByIdId: ID!) {
            likeById(id: $likeByIdId) {
                id
                user {
                id
                user_name
                }
                post {
                id
                }
            }
            }`,
        variables: {likeByIdId: id},
      })
      .expect(200, (err, res) => {
        if (err) {
          reject(err);
        }
        const like = res.body.data.likeById;
        expect(like).toHaveProperty('id');
        expect(like).toHaveProperty('user');
        expect(like).toHaveProperty('post');
        resolve(like);
      });
  });
};
/*mutation Mutation($post: ID!) {
  createLike(post: $post) {
    id
    user {
      id
      user_name
    }
    post {
      id
    }
  }
} */
const createLike = async (
  url: string | Function,
  id: string,
  token: string
): Promise<LikeTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation Mutation($post: ID!) {
                createLike(post: $post) {
                    id
                    user {
                    id
                    user_name
                    }
                    post {
                    id
                    }
                }
                }`,
        variables: {post: id},
      })
      .expect(200, (err, res) => {
        if (err) {
          reject(err);
        }
        const like = res.body.data.createLike;
        expect(like).toHaveProperty('id');
        expect(like).toHaveProperty('user');
        expect(like).toHaveProperty('post');
        resolve(like);
      });
  });
};
// fail like
const createLikeFail = async (
  url: string | Function,
  id: string,
  token: string
): Promise<LikeTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation Mutation($post: ID!) {
                    createLike(post: $post) {
                        id
                        user {
                        id
                        user_name
                        }
                        post {
                        id
                        }
                    }
                    }`,
        variables: {post: id},
      })
      .expect(200, (err, res) => {
        if (err) {
          reject(err);
        }
        const like = res.body.data.createLike;
        expect(like).toBe(null);
        resolve(like);
      });
  });
};

/*mutation Mutation($deleteLikeId: ID!) {
  deleteLike(id: $deleteLikeId) {
    id
    user {
      id
      user_name
    }
    post {
      id
    }
  }
} */
const deleteLike = async (
  url: string | Function,
  id: string,
  token: string
): Promise<LikeTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation Mutation($deleteLikeId: ID!) {
                    deleteLike(id: $deleteLikeId) {
                        id
                        user {
                        id
                        user_name
                        }
                        post {
                        id
                        }
                    }
                    }`,
        variables: {deleteLikeId: id},
      })
      .expect(200, (err, res) => {
        if (err) {
          reject(err);
        }
        const like = res.body.data.deleteLike;
        expect(like).toHaveProperty('id');
        expect(like).toHaveProperty('user');
        expect(like).toHaveProperty('post');
        resolve(like);
      });
  });
};

export {getLikes, getLikeById, createLike, deleteLike, createLikeFail};
