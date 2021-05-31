import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  BlogDetailComponent,
  BlogListComponent,
  CreateUpdateBlogComponent,
} from './components';
import { GetPostByIdResolver, PostResolver } from './resolvers';

const routes: Routes = [
  {
    path: '',
    component: BlogListComponent,
    resolve: {
      posts: PostResolver,
    },
  },
  {
    path: 'new',
    component: CreateUpdateBlogComponent,
  },
  {
    path: ':id',
    component: BlogDetailComponent,
    resolve: {
      post: GetPostByIdResolver,
    },
  },
  {
    path: ':id/edit',
    component: CreateUpdateBlogComponent,
    resolve: {
      post: GetPostByIdResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogsRoutingModule {}
