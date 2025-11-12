import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';

const GET_ALL_USER_QUERY = gql`
  query GetAllUsers {
    users {
      id
      username
      email
      profile {
        avatar
      }
    }
  }
`;

const GET_USER_BY_ID_QUERY = gql`
  query GetUserById($id: String!) {
    getUser(id: $id) {
      id
      username
      email
      role
      profile {
        avatar
        bio
      }
      posts {
        id
        title
        content
        tags {
          id
          name
        }
      }
    }
  }
`;

export interface UserList {
  id: string;
  username: string;
  email: string;
  profile: {
    avatar: string;
  } | null;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  profile: {
    avatar: string;
    bio: string;
  } | null;
  posts: {
    id: string;
    title: string;
    content: string;
    tags: { id: string; name: string }[];
  }[];
}

export interface UserResponse {
  getUser: User;
}

export interface UserListResponse {
  users: UserList[];
}

@Injectable({
  providedIn: 'root',
})
export class Users {
  private apollo = inject(Apollo);

  constructor() { }

  getAllUsers(): Observable<UserListResponse> {
    return this.apollo.query<UserListResponse>({
      query: GET_ALL_USER_QUERY
    }).pipe(
      map(result => {
        if (result.error) {
          throw new Error(result.error.message);
        }
        if (!result.data) {
          throw new Error('No data received from the server.');
        }
        return result.data;
      })
    );
  }

  getUserById(id: string): Observable<UserResponse> {
    return this.apollo.query<UserResponse>({
      query: GET_USER_BY_ID_QUERY,
      variables: { id }
    }).pipe(
      map(result => {
        if (result.error) {
          throw new Error(result.error.message);
        }
        if (!result.data) {
          throw new Error('No data received from the server.');
        }
        return result.data;
      })
    );
  }

}
