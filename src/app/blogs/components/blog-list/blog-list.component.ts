import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { noop, Observable, of } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { User } from '../../../auth/models';
import { AuthService } from '../../../core/services';
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

  allPost$: Observable<Post[]> = of([]);
  currentUser!: User;

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.getAllPosts();
  }

  getAllPosts() {
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
      .pipe(pluck('data'));
  }

  onDelete(postId: string) {
    this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'confirmation-dialog--panel',
      minWidth: '300px',
      data: {
        title: 'Confirmation',
        description: 'Are you sure you want to delete?',
        onConfirm: () => {
          this.blogService
            .deletePost(postId)
            .subscribe(noop, noop, () => this.getAllPosts());
        },
      },
    });
  }
}
