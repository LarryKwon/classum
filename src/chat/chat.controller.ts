import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { ReadChatPolicyHandler } from '../auth/guards/policy-handler/chat/chat.read-policy.handler';
import { CheckPolicies } from '../auth/decorator/policy.decorator';
import { CreateChatPolicyHandler } from '../auth/guards/policy-handler/chat/chat.create-policy.handler';
import { UpdateChatPolicyHandler } from '../auth/guards/policy-handler/chat/chat.update-policy.handler';
import { DeleteChatPolicyHandler } from '../auth/guards/policy-handler/chat/chat.delete-policy.handler';
import { FindChatsDto } from './dto/find-chats.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { DeleteChatDto } from './dto/delete-chat.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '../user/entity/user.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadChatPolicyHandler())
  findAllChats(findChatsDto: FindChatsDto, @GetUser() user: User) {
    return this.chatService.findAllChats(findChatsDto, user);
  }

  @Post('/reply')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CreateChatPolicyHandler())
  createReply(createReplyDto: CreateReplyDto, @GetUser() user: User) {
    return this.chatService.createReply(createReplyDto, user);
  }

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CreateChatPolicyHandler())
  createChat(createChatDto: CreateChatDto, @GetUser() user: User) {
    return this.chatService.createChat(createChatDto, user);
  }

  @Patch('/:id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new UpdateChatPolicyHandler())
  updateChat(updateChatDto: UpdateChatDto) {
    return this.chatService.updateChat(updateChatDto);
  }

  @Delete('/:id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new DeleteChatPolicyHandler())
  deleteChat(deleteChatDto: DeleteChatDto) {
    return this.chatService.deleteChat(deleteChatDto);
  }
}
