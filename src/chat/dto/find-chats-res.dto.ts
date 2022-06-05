import { User } from '../../user/entity/user.entity';
import { Space } from '../../space/entity/space.entity';
import { Chat } from '../entity/chat.entity';
import { Post } from '../../post/entity/post.entity';

export class FindChatsResDto {
  id: number;
  writer: User;
  contents: string;
  isAnonymous: boolean;
  post: Post;
  children: Chat[];
  parent: Chat;

  constructor(chat: Chat, currentUser: User) {
    this.id = chat.id;
    if (chat.writer.id === currentUser.id) {
      this.writer = chat.writer;
    } else {
      this.writer = null;
    }
    this.contents = chat.contents;
    this.isAnonymous = chat.isAnonymous;
    this.post = chat.post;
    this.children = chat.children;
    this.parent = chat.parent;
  }
}
