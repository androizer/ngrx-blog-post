import { User } from '../../auth/models/user.model';
import { uuid } from '../../core/types';
import { Comment } from './comment.model';
import { Image } from './image.model';

export class Post {
  id: uuid;
  title: string;
  content: string;
  votes: uuid[];
  author: User;
  authorId: uuid;
  comments: Comment[];
  commentIds: uuid[];
  image: Image;
  tags: string[];
  bookmarkedIds: uuid[];
  createdBy?: uuid;
  modifiedBy?: uuid;
  createdOn?: Date;
  modifiedOn?: Date;
  deletedOn?: Date;

  // extra
  isUpvoted?: boolean;
  isBookmarked: boolean;

  constructor(data = {} as Partial<Post>) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.votes = data.votes ?? [];
    this.author = data.author && new User(data.author);
    this.authorId = data.authorId;
    this.comments = data.comments
      ? data.comments.map((item) => new Comment(item))
      : [];
    this.commentIds = data.commentIds;
    this.image = data.image && new Image(data.image);
    this.tags = data.tags ?? [];
    this.bookmarkedIds = data?.bookmarkedIds ?? [];
    this.createdBy = data.createdBy;
    this.modifiedBy = data.modifiedBy;
    this.createdOn = data.createdOn;
    this.modifiedOn = data.modifiedOn;
    this.deletedOn = data.deletedOn;
  }
}
