import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';

const GET_ALL_POSTS_QUERY = gql`
  query GetAllPosts {
    posts {
      id
      title
      content
      tags {
        id
        name
      }
      user {
        id
        username
        profile {
          avatar
        }
      }
    }
  }
`;

const CREATE_POST_MUTATION = gql`
  mutation CreatePost($createPostInput: CreatePostInput!) {
    createPost(createPostInput: $createPostInput) {
      id
      title
      content
      tags {
        id
        name
      }
      user {
        username
        profile {
          avatar
        }
      }
    }
  }
`;

export interface Post {
  id: string;
  title: string;
  content: string;
  tags: { name: string, id: string }[];
  user: {
    id: string;
    username: string;
    profile: {
      avatar: string;
    };
  };
}

export interface CreatePostInput {
  title: string;
  content: string;
  tagIds: string[];
}

export interface PostResponse {
  posts: Post[];
}

export interface CreatePostResponse {
  createPost: Post;
}

@Injectable({
  providedIn: 'root',
})
export class Posts {
  private apollo = inject(Apollo);

  constructor() { }

  /**
   * Fetches all posts from the GraphQL API.
   * @returns {Post[]}
   */
  getAllPosts(): Observable<Post[]> {
    return this.apollo.query<PostResponse>({
      query: GET_ALL_POSTS_QUERY,
    }).pipe(
      map(result => {
        if(result.error) {
          throw new Error(result.error.message);
        }
        if(!result.data) {
          throw new Error('No data received from the server.');
        }
        return result.data.posts;
      })
    )
  }

  /**
   * Creates a new post.
   * @param {CreatePostInput} createPostInput - The input data for creating a post
   * @returns {Observable<Post>} - The created post
   */
  createPost(createPostInput: CreatePostInput): Observable<Post> {
    return this.apollo.mutate<CreatePostResponse>({
      mutation: CREATE_POST_MUTATION,
      variables: { createPostInput }
    }).pipe(
      map(result => {
        if (result.error) {
          throw new Error(result.error.message);
        }
        if (!result.data) {
          throw new Error('No data received from the server.');
        }
        return result.data.createPost;
      })
    );
  }
}
