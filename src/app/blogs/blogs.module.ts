import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';

import { BlogsRoutingModule } from './blogs-routing.module';
import {
  BlogDetailComponent,
  BlogListComponent,
  CreateUpdateBlogComponent,
} from './components';
import { BlogService, CommentService } from './services';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

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
  ],
  providers: [BlogService, CommentService],
})
export class BlogsModule {}
