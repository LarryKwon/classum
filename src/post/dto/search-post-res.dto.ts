import { User } from '../../user/entity/user.entity';
import { Space } from '../../space/entity/space.entity';
import { Chat } from '../../chat/entity/chat.entity';
import { Post } from '../entity/post.entity';
import { writer } from 'repl';

export class SearchPostResDto {
  id: number;
  writer: User;
  contents: string;
  attachment?: string;
  isAnonymous: boolean;
  space: Space;
  chats: Chat[];

  constructor(post: Post, currentUser: User) {
    this.id = post.id;
    if (post.writer.id === currentUser.id) {
      this.writer = post.writer;
    } else {
      this.writer = null;
    }
    this.contents = post.contents;
    this.attachment = post.attachment;
    this.isAnonymous = post.isAnonymous;
    this.space = post.space;
    this.chats = post.chats;
  }
}
