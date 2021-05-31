import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { forkJoin, Observable, of } from 'rxjs';
import { concatMap, filter, first, map, takeUntil, tap } from 'rxjs/operators';

import { AuthSelectors } from '../../../auth/redux/auth.selectors';
import { uuid } from '../../../core/types';
import { Post } from '../../models';
import { CommentActions, PostActions } from '../../redux/actions';
import { CommentSelectors, PostSelectors } from '../../redux/selectors';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
})
export class BlogDetailComponent implements OnInit {
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly renderer2: Renderer2,
    private readonly matSnackbar: MatSnackBar,
    private readonly store: Store,
    private readonly action$: Actions
  ) {
    this.commentControl = new FormControl(null, [Validators.required]);
  }

  private _bgCover!: ElementRef;
  @ViewChild('bgCover')
  set bgCover(value) {
    if (value) {
      this._bgCover = value;
      this.setCoverImage();
    }
  }

  get bgCover() {
    return this._bgCover;
  }

  post: Partial<Post> = {};
  commentControl: FormControl;
  postId: uuid;
  error$: Observable<Action>;

  ngOnInit(): void {
    this.postId = this.activatedRoute.snapshot.params.id;
    this.error$ = this.action$.pipe(
      ofType(PostActions.queryOneError),
      tap(() => {
        this.matSnackbar.open('Error while fetching Post!', 'OK');
      })
    );
    this.store
      .select(PostSelectors.getById(this.postId))
      .pipe(
        takeUntil(this.error$),
        filter((post) => !!post),
        concatMap((post) => this._combineRelatedStreams(post)),
        map(([post, comments, user]) => {
          return {
            ...post,
            comments,
            isUpvoted: post.votes.includes(user.id),
          } as Post;
        })
      )
      .subscribe((post) => {
        this.post = post;
        this.setCoverImage();
      });
  }

  addComment() {
    if (this.commentControl.valid) {
      const comment = this.commentControl.value;
      // create comment using store
      this.store.dispatch(
        CommentActions.createOne({
          comment,
          postId: this.postId,
          query: { join: [{ field: 'author' }, { field: 'author.avatar' }] },
        })
      );
      this.action$
        .pipe(ofType(CommentActions.createOneSuccess))
        .subscribe(() => {
          this.commentControl.reset();
        });
    }
  }

  setCoverImage() {
    if (this.post.image && this.bgCover) {
      this.renderer2.setStyle(
        this.bgCover.nativeElement,
        'background-image',
        this.post.image.base64Url
      );
    }
  }

  toggleUpvote(post: Partial<Post>) {
    // optimistic update
    this.store.dispatch(PostActions.toggleUpvote({ post }));
    this.action$.pipe(ofType(PostActions.toggleUpvoteError)).subscribe(() => {
      this.matSnackbar.open('Something bad happened!', 'OK', {
        direction: 'rtl',
        horizontalPosition: 'end',
      });
    });
  }

  private _combineRelatedStreams(post: Post) {
    return forkJoin([
      of(post),
      this.store.select(CommentSelectors.filterByIds(post.commentIds)).pipe(
        filter((comments) => comments.length === post.commentIds.length),
        first()
      ),
      this.store.select(AuthSelectors.currentUser).pipe(
        filter((user) => !!user),
        first()
      ),
    ]);
  }
}
