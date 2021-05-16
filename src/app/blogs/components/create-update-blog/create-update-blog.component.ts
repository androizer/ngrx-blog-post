import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';

import { uuid } from '../../../core/types';
import { Post } from '../../models';
import { BlogService } from '../../services';

@Component({
  selector: 'app-create-update-blog',
  templateUrl: './create-update-blog.component.html',
  styleUrls: ['./create-update-blog.component.scss'],
})
export class CreateUpdateBlogComponent implements OnInit {
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly blogService: BlogService,
    private readonly renderer2: Renderer2,
    private readonly router: Router
  ) {
    this.formGroup = new FormGroup({
      coverImage: new FormControl(null),
      title: new FormControl(null, [Validators.required]),
      content: new FormControl(null, [Validators.required]),
      tags: new FormControl([]),
    });
  }

  @ViewChild('bgImage') private readonly imageWrapper!: ElementRef;

  readonly allowedTypes = ['image/jpg', 'image/jpeg', 'image/png'];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  formGroup: FormGroup;
  isImageSaved!: boolean;
  post!: Post;
  postId!: uuid;

  ngOnInit() {
    this.postId = this.activatedRoute.snapshot.params['id'];
    if (this.postId) {
      this.blogService
        .getPostById(this.postId, { join: { field: 'image' } })
        .subscribe((payload) => {
          this.post = payload;
          this.formGroup.patchValue({
            ...payload,
          });
          if (payload.image?.base64Url) {
            this.setCoverImage(payload.image.base64Url);
          }
        });
    }
  }

  fileSelectionChange(event: any): void {
    const files = event.target.files as FileList;
    const file = files[0];

    if (file) {
      if (!this.allowedTypes.includes(file.type)) {
        throw new Error('File type unsupported');
      }

      const reader = new FileReader();
      reader.onload = (evt) => {
        this.setCoverImage(`url(${evt.target?.result})`);
        this.formGroup.get('coverImage')?.setValue(file);
      };

      reader.readAsDataURL(file);
    }
  }

  setCoverImage(baseUrl: string) {
    this.renderer2.setStyle(
      this.imageWrapper.nativeElement,
      'background-image',
      baseUrl
    );
    this.isImageSaved = true;
  }

  resetCoverImage() {
    this.isImageSaved = false;
    this.renderer2.setStyle(
      this.imageWrapper.nativeElement,
      'background-image',
      'none'
    );
    this.formGroup.get('coverImage')?.reset();
  }

  resetForm() {
    this.formGroup.reset();
    this.resetCoverImage();
  }

  onFormSubmit() {
    const { formGroup } = this;
    if (formGroup.valid) {
      const post = formGroup.value;
      const formData = new FormData();
      formData.append('coverImage', post.coverImage);
      formData.append('title', post.title);
      formData.append('content', post.content);
      formData.append('tags', JSON.stringify(post.tags));
      if (!this.postId) {
        // Create new POST
        this.blogService.createPost(formData).subscribe(() => {
          this.router.navigate(['/blogs']);
        });
      } else {
        if (this.post.image && !this.isImageSaved) {
          formData.append('deleteCoverImg', 'true');
        }
        // Update the existing POST
        this.blogService.updatePost(this.postId, formData).subscribe(() => {
          this.router.navigate(['/blogs']);
        });
      }
    }
  }

  removeTag(tag: string) {
    const tags = this.formGroup.get('tags')?.value as string[];
    const index = tags.indexOf(tag);

    if (index >= 0) {
      tags.splice(index, 1);
    }
  }

  addTag(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    const tags = this.formGroup.get('tags')?.value as string[];

    // Add tags
    if ((value || '').trim()) {
      tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
}
