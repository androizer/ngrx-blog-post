import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, finalize, first, tap } from 'rxjs/operators';
import { PostActions } from '../redux/actions';
import { PostSelectors } from '../redux/selectors';

@Injectable()
export class PostResolver implements Resolve<unknown> {
  constructor(private readonly store: Store) {}

  isLoading = false;

  resolve() {
    return this.store.select(PostSelectors.isLoaded).pipe(
      tap((loaded) => {
        if (!loaded && !this.isLoading) {
          this.isLoading = true;
          this.store.dispatch(
            PostActions.queryAll({
              query: {
                join: [
                  { field: 'author' },
                  { field: 'image' },
                  { field: 'author.avatar' },
                ],
                sort: { field: 'createdOn', order: 'DESC' },
              },
            })
          );
        }
      }),
      filter((loaded) => loaded),
      first(),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }
}
