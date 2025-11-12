import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';

const GET_ALL_TAGS_QUERY = gql`
  query GetAllTags {
    tags {
      id
      name
    }
  }
`;

export interface Tag {
  id: string;
  name: string;
}

export interface TagsResponse {
  tags: Tag[];
}

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  private apollo = inject(Apollo);

  /**
   * Fetches all tags from the GraphQL API.
   * @returns {Observable<Tag[]>}
   */
  getAllTags(): Observable<Tag[]> {
    return this.apollo.query<TagsResponse>({
      query: GET_ALL_TAGS_QUERY,
    }).pipe(
      map(result => {
        if (result.error) {
          throw new Error(result.error.message);
        }
        if (!result.data) {
          throw new Error('No data received from the server.');
        }
        return result.data.tags;
      })
    );
  }
}
