import { User } from '../../user/entity/user.entity';
import { Chat } from '../entity/chat.entity';
import { FindChatsResDto } from '../dto/find-chats-res.dto';

export class ChatConverter {
  static toFindResponseDto(chat: Chat, currentUser: User): FindChatsResDto {
    return new FindChatsResDto(chat, currentUser);
  }
}
