import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Comment } from '../models';
import { environment } from '../../../environments/environment';
import { CreateQueryParams, RequestQueryBuilder } from '@nestjsx/crud-request';
import { map } from 'rxjs/operators';
import { CrudListResponse } from '../../core/types';

@Injectable()
export class CommentService {
  constructor(private readonly http: HttpClient) {}

  getAllComments(query: CreateQueryParams = {}) {
    const qb = RequestQueryBuilder.create(query).query();
    return this.http
      .get<CrudListResponse<Comment>>(`${environment.apiUrl}/comments`, {
        params: new HttpParams({ fromString: qb }),
      })
      .pipe(
        map((payload) => {
          return {
            ...payload,
            data: payload.data.map((comment) => new Comment(comment)),
          };
        })
      );
  }

  createComment(
    content: string,
    postId: string,
    query: CreateQueryParams = {}
  ) {
    const qb = RequestQueryBuilder.create(query).query();
    return this.http
      .post<Comment>(
        `${environment.apiUrl}/comments`,
        {
          content,
          postId,
        },
        { params: new HttpParams({ fromString: qb }) }
      )
      .pipe(map((payload) => new Comment(payload)));
  }
}
