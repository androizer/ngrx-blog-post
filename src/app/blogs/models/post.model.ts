import { User } from '../../auth/models/user.model';
import { uuid } from '../../core/types';
import { Comment } from './comment.model';
import { Image } from './image.model';

export class Post {
  id: uuid;
  title: string;
  content: string;
  votes: number;
  author: User;
  comments: Comment[];
  image: Image;
  tags: string[];
  createdBy?: string;
  modifiedBy?: string;
  createdOn?: Date;
  modifiedOn?: Date;
  deletedOn?: Date;

  constructor(data = {} as Partial<Post>) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.votes = data.votes;
    this.author = data.author && new User(data.author);
    this.comments = data.comments
      ? data.comments.map((item) => new Comment(item))
      : [];
    this.image = data.image && new Image(data.image);
    this.tags = data.tags ?? [];
    this.createdBy = data.createdBy;
    this.modifiedBy = data.modifiedBy;
    this.createdOn = data.createdOn;
    this.modifiedOn = data.modifiedOn;
    this.deletedOn = data.deletedOn;
  }
}
