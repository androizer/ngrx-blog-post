import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { CreateQueryParams } from '@nestjsx/crud-request';
import { Store } from '@ngrx/store';

import { PostActions } from '../redux/actions';

@Injectable()
export class GetPostByIdResolver implements Resolve<unknown> {
  constructor(private readonly store: Store) {}

  resolve(route: ActivatedRouteSnapshot): unknown {
    const postId = route.params.id;
    const query: CreateQueryParams = {
      join: [
        { field: 'image' },
        { field: 'author' },
        { field: 'author.avatar' },
      ],
    };
    // Either simply dispatch the event (extra logic inside the queryOne)
    // or dispatch the event only when existing entity doesn't exists
    // inside the store queried via selector.
    const isEditRoute = route.url.some((segment) =>
      segment.path.includes('edit')
    );
    if (isEditRoute) {
      return this.store.dispatch(PostActions.queryOne({ id: postId, query }));
    }
    return this.store.dispatch(
      PostActions.queryOneWithComments({ id: postId, query })
    );
  }
}
