import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import SpaceExists from '../../space-role/decorator/space-exists.validator';
import ChatExists from '../decorator/chat-exists.validator';

export class UpdateChatDto {
  @IsString()
  @IsNotEmpty()
  contents: string;

  @SpaceExists()
  @IsNumber()
  spaceId: number;

  @ChatExists()
  @IsNumber()
  chatId: number;
}
