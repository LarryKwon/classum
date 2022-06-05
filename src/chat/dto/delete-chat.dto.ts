import SpaceExists from '../../space-role/decorator/space-exists.validator';
import { IsNotEmpty, IsNumber } from 'class-validator';
import ChatExists from '../decorator/chat-exists.validator';

export class DeleteChatDto {
  @SpaceExists()
  @IsNumber()
  spaceId: number;

  @ChatExists()
  @IsNumber()
  @IsNotEmpty()
  chatId: number;
}
