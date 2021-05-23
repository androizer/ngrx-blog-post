import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { currentUserSelector } from 'src/app/auth/auth.selector';
import { AuthService } from 'src/app/core/services';

import { User } from '../../../auth/models';
import { BlogsAction } from '../../action.types';
import { allBlogsSelector } from '../../blogs.selector';
import { Post } from '../../models';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent implements OnInit {
  constructor(private readonly store: Store, private readonly authService: AuthService) {}

  allPost$: Observable<Post[]> = of([]);
  currentUser!: User;

  ngOnInit() {
    this.store.select(currentUserSelector).subscribe((user) => {
      this.currentUser = user;
    });
    
    this.store.dispatch(BlogsAction.loadAllBlogs());
    this.allPost$ = this.store.select(allBlogsSelector);
  }
}
