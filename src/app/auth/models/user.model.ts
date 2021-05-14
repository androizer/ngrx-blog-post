import { Image } from '../../blogs/models/image.model';
import { Post } from '../../blogs/models/post.model';
import { uuid } from '../../core/types';
import { Role } from '../enums';

export class User {
  id: uuid;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  password: string;
  role: Role[];
  posts: Post[];
  comments: Comment[];
  avatar: Image;
  createdBy?: uuid;
  modifiedBy?: uuid;
  createdOn?: Date;
  modifiedOn?: Date;
  deletedOn?: Date;

  constructor(data = {} as Partial<User>) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.fullName = data.fullName;
    this.password = data.password;
    this.role = data.role;
    this.posts = data.posts ?? [];
    this.comments = data.comments ?? [];
    this.createdBy = data.createdBy;
    this.modifiedBy = data.modifiedBy;
    this.createdOn = data.createdOn;
    this.modifiedOn = data.modifiedOn;
    this.deletedOn = data.deletedOn;
    this.avatar = data.avatar && new Image(data.avatar);
  }
}
