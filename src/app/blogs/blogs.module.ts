import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { BlogsRoutingModule } from './blogs-routing.module';
import {
  BlogDetailComponent,
  BlogListComponent,
  CreateUpdateBlogComponent,
} from './components';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { CommentEffects, PostEffects } from './redux/effects';
import {
  commentFeature,
  commentReducer,
  postFeature,
  postReducer,
} from './redux/reducers';
import { GetPostByIdResolver, PostResolver } from './resolvers';
import { BlogService, CommentService } from './services';

@NgModule({
  declarations: [
    BlogListComponent,
    BlogDetailComponent,
    CreateUpdateBlogComponent,
    ConfirmDialogComponent,
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
    MatDialogModule,
    ReactiveFormsModule,
    StoreModule.forFeature(postFeature, postReducer),
    StoreModule.forFeature(commentFeature, commentReducer),
    EffectsModule.forFeature([PostEffects, CommentEffects]),
  ],
  providers: [BlogService, CommentService, PostResolver, GetPostByIdResolver],
})
export class BlogsModule {}
