import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { concatMap, pluck } from 'rxjs/operators';

import { User } from '../../../auth/models';
import { AuthService } from '../../../core/services';
import { Post } from '../../models';
import { BlogService } from '../../services';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent implements OnInit {
  constructor(
    private readonly blogService: BlogService,
    private readonly authService: AuthService
  ) {}

  allPost$: Observable<Post[]> = of([]);
  currentUser!: User;

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.allPost$ = this.blogService
      .getAllPost({
        join: [
          { field: 'author' },
          { field: 'image' },
          { field: 'comments', select: ['id'] },
          { field: 'author.avatar' },
        ],
        sort: { field: 'createdOn', order: 'DESC' },
      })
      .pipe(
        pluck('data'),
        // Convert blob to base64URL
        concatMap((payload) => {
          const obs$ = payload.map((item) => {
            return this.blogService.appendBase64Url(item);
          });
          return forkJoin(obs$);
        })
      );
  }
}
