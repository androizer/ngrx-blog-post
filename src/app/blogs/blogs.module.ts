import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { BlogsRoutingModule } from './blogs-routing.module';
import { BlogsEffect } from './blogs.effect';
import { CommentEffects } from './comments.effect';
import {
  BlogDetailComponent,
  BlogListComponent,
  CreateUpdateBlogComponent,
} from './components';
import * as fromBlogs from './reducers/blogs.reducer';
import * as fromComments from './reducers/comments.reducer';
import { BlogService, CommentService } from './services';

@NgModule({
  declarations: [
    BlogListComponent,
    BlogDetailComponent,
    CreateUpdateBlogComponent,
  ],
  imports: [
    CommonModule,
    BlogsRoutingModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    StoreModule.forFeature(fromBlogs.blogsFeatureKey, fromBlogs.blogsReducer),
    StoreModule.forFeature(fromComments.commentsFeatureKey, fromComments.commentsReducer),
    EffectsModule.forFeature([BlogsEffect, CommentEffects]),
  ],
  providers: [BlogService, CommentService],
})
export class BlogsModule {}
