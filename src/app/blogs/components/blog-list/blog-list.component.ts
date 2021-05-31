import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { User } from '../../../auth/models';
import { AuthSelectors } from '../../../auth/redux/auth.selectors';
import { uuid } from '../../../core/types';
import { Post } from '../../models';
import { PostActions } from '../../redux/actions';
import { PostSelectors } from '../../redux/selectors/post.selectors';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogListComponent implements OnInit {
  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store
  ) {}

  allPost$: Observable<Post[]>;
  currentUser$: Observable<User>;

  ngOnInit() {
    this.currentUser$ = this.store.select(AuthSelectors.currentUser);
    this.allPost$ = this.store.select(PostSelectors.getAllPost);
  }

  onDelete(postId: uuid) {
    this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'confirmation-dialog--panel',
      minWidth: '300px',
      data: {
        title: 'Confirmation',
        description: 'Are you sure you want to delete?',
        loading: this.store.select(PostSelectors.isLoading),
        onConfirm: () => {
          this.store.dispatch(PostActions.deleteOne({ id: postId }));
        },
      },
    });
  }

  toggleBookmark(post: Post) {
    this.store.dispatch(PostActions.toggleBookmark({ post }));
  }
}
