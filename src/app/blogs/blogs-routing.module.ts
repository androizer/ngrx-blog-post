import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  BlogDetailComponent,
  BlogListComponent,
  CreateUpdateBlogComponent,
} from './components';

const routes: Routes = [
  {
    path: '',
    component: BlogListComponent,
  },
  {
    path: 'new',
    component: CreateUpdateBlogComponent,
  },
  {
    path: ':id',
    component: BlogDetailComponent,
  },
  {
    path: ':id/edit',
    component: CreateUpdateBlogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogsRoutingModule {}
