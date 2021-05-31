import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateQueryParams, RequestQueryBuilder } from '@nestjsx/crud-request';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { ServerEventService } from '../../core/services';
import { CrudListResponse, uuid } from '../../core/types';
import { Comment } from '../models';
import { PostActions } from '../redux/actions';

@Injectable()
export class CommentService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: Store,
    private readonly serverEvent: ServerEventService
  ) {
    this._listenServerEvents();
  }

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

  getCommentByPost(postId: uuid, query: CreateQueryParams) {
    const qParams: CreateQueryParams = {
      ...query,
      filter: [
        { field: 'postId', operator: '$eq', value: postId },
        ...(Array.isArray(query.filter) ? query.filter : [query.filter]),
      ],
    };
    const qb = RequestQueryBuilder.create(qParams).query();
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

  private _listenServerEvents() {
    this.serverEvent
      .onEvent<{ id: uuid; postId: uuid }>('CommentCreated')
      .subscribe(({ data }) => {
        const { id: commentId, postId } = data;
        if (postId) {
          this.store.dispatch(
            PostActions.triggerAddCommentId({ postId, commentId })
          );
        }
      });
  }
}
