import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { concatMap } from 'rxjs/operators';

import { uuid } from '../../../core/types';
import { Post } from '../../models';
import { BlogService, CommentService } from '../../services';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
})
export class BlogDetailComponent implements OnInit {
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly blogService: BlogService,
    private readonly commentService: CommentService,
    private readonly renderer2: Renderer2
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
  postId: uuid = '';

  ngOnInit(): void {
    this.postId = this.activatedRoute.snapshot.params.id;
    this.blogService
      .getPostById(this.postId, {
        join: [
          { field: 'comments' },
          { field: 'author' },
          { field: 'image' },
          { field: 'author.avatar' },
          { field: 'comments.author' },
          { field: 'comments.author.avatar' },
        ],
        sort: { field: 'comments.createdOn', order: 'DESC' },
      })
      .pipe(concatMap((item) => this.blogService.appendBase64Url(item)))
      .subscribe((payload) => {
        this.post = payload;
        this.setCoverImage();
      });
  }

  addComment() {
    if (this.commentControl.valid) {
      this.commentService
        .createComment(this.commentControl.value, this.postId, {
          join: [{ field: 'author' }, { field: 'author.avatar' }],
        })
        .subscribe((payload) => {
          this.post.comments?.unshift(payload);
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
}
