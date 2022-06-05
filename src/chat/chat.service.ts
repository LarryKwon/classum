import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRepository } from './repository/chat.repository';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { PostService } from '../post/post.service';
import { ChatTreeRepository } from './repository/chat.tree-repository';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { DeleteChatDto } from './dto/delete-chat.dto';
import { User } from '../user/entity/user.entity';
import { SpaceService } from '../space/space.service';
import { Action } from '../auth/enum/Action';
import { FindChatsDto } from './dto/find-chats.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRepository)
    private readonly chatRepository: ChatRepository,
    @InjectRepository(ChatTreeRepository)
    private readonly chatTreeRepository: ChatTreeRepository,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly postService: PostService,
    private readonly spaceService: SpaceService,
  ) {}

  async findChatById(id: number) {
    return await this.chatTreeRepository.findOneOrFail(id);
  }

  async findAllChats(findChatsDto: FindChatsDto, user: User) {
    const { spaceId, postId } = findChatsDto;
    const space = await this.spaceService.findSpaceById(spaceId);
    const post = await this.postService.findPostById(postId);

    const ability = await this.caslAbilityFactory.createForUser(user, space);
    if (ability.can(Action.Read, post)) {
      return post.chats;
    } else {
      throw new ForbiddenException(
        `can't see chats on posts in space that you are not participated in`,
      );
    }
  }

  async createChat(createChatDto: CreateChatDto, user: User) {
    const { contents, isAnonymous, spaceId, postId } = createChatDto;
    const space = await this.spaceService.findSpaceById(spaceId);
    const post = await this.postService.findPostById(postId);
    const createdChat = await this.chatRepository.create({
      writer: user,
      contents: contents,
      isAnonymous: isAnonymous,
      post: post,
    });
    const ability = await this.caslAbilityFactory.createForUser(user, space);
    // role에 따라 anonymous로 작성할 수 있는지 & 해당 post에 read 권한이 있는지
    if (
      ability.can(Action.Create, createdChat) &&
      ability.can(Action.Read, post)
    ) {
      return await this.chatRepository.save(createdChat);
    } else {
      throw new BadRequestException(
        `manager can't create chat with anonymous options`,
      );
    }
  }

  async createReply(createReplyDto: CreateReplyDto, user: User) {
    const { contents, isAnonymous, spaceId, postId, parentId } = createReplyDto;
    const post = await this.postService.findPostById(postId);
    const space = await this.spaceService.findSpaceById(spaceId);
    const parentChat = await this.findChatById(parentId);
    const createdChat = await this.chatRepository.create({
      writer: user,
      contents: contents,
      isAnonymous: isAnonymous,
      post: post,
      parent: parentChat,
    });
    const ability = await this.caslAbilityFactory.createForUser(user, space);
    // role에 따라 anonymous로 작성할 수 있는지 & 해당 post에 read 권한이 있는지
    if (
      ability.can(Action.Create, createdChat) &&
      ability.can(Action.Read, post)
    ) {
      return await this.chatRepository.save(createdChat);
    } else {
      throw new BadRequestException(
        `manager can't create chat with anonymous options`,
      );
    }
  }

  async updateChat(updateChatDto: UpdateChatDto) {
    return null;
  }
  async deleteChat(deleteChatDto: DeleteChatDto) {
    return null;
  }
}
