import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { noop, Observable, of } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

import { User } from '../../../auth/models';
import { AuthService } from '../../../core/services';
import { uuid } from '../../../core/types';
import { Post } from '../../models';
import { BlogService } from '../../services';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent implements OnInit {
  constructor(
    private readonly blogService: BlogService,
    private readonly authService: AuthService,
    private readonly dialog: MatDialog
  ) {}

  allPost: Post[] = [];
  currentUser: User;

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.getAllPosts();
  }

  getAllPosts() {
    this.blogService
      .getAllPost({
        join: [
          { field: 'author' },
          { field: 'image' },
          { field: 'author.avatar' },
        ],
        sort: { field: 'createdOn', order: 'DESC' },
      })
      .pipe(
        pluck('data'),
        map((posts) => {
          return posts.map((post) => {
            const userBookmarkIds = this.currentUser.bookmarkIds;
            if (post.bookmarkedIds.some((id) => userBookmarkIds.includes(id))) {
              post.isBookmarked = true;
            }
            return post;
          });
        })
      )
      .subscribe((posts) => (this.allPost = posts));
  }

  onDelete(postId: uuid) {
    this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'confirmation-dialog--panel',
      minWidth: '300px',
      data: {
        title: 'Confirmation',
        description: 'Are you sure you want to delete?',
        onConfirm: () => {
          this.blogService.deletePost(postId).subscribe(noop, noop, () => {
            this.allPost = this.allPost.filter((post) => post.id !== postId);
          });
        },
      },
    });
  }

  toggleBookmark(postId: uuid) {
    this.blogService.toggleBookmark(postId).subscribe((payload) => {
      this.allPost = this.allPost.map((post) => {
        if (postId === post.id) {
          post.isBookmarked = payload.isRemoved ? false : true;
          if (post.isBookmarked) {
            this.currentUser.bookmarkIds.push(payload.id);
          } else {
            const index = this.currentUser.bookmarkIds.findIndex(
              (id) => id === payload.id
            );
            this.currentUser.bookmarkIds.splice(index, 1);
          }
        }
        return post;
      });
    });
  }
}
