import { User } from '../../auth/models/user.model';
import { uuid } from '../../core/types';
import { Post } from './post.model';

export class Comment {
  id: uuid;
  content: string;
  author: User;
  post: Post;
  createdBy?: string;
  modifiedBy?: string;
  createdOn?: Date;
  modifiedOn?: Date;
  deletedOn?: Date;

  constructor(data = {} as Partial<Comment>) {
    this.id = data.id;
    this.content = data.content;
    this.author = data.author && new User(data.author);
    this.post = data.post;
    this.createdBy = data.createdBy;
    this.modifiedBy = data.modifiedBy;
    this.createdOn = data.createdOn;
    this.modifiedOn = data.modifiedOn;
    this.deletedOn = data.deletedOn;
  }
}
