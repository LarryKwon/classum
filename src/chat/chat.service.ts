import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
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
import { Chat } from './entity/chat.entity';
import { UserSpaceService } from '../userspace/userspace.service';
import { SpaceRole } from '../space-role/entity/space-role.entity';
import { Role } from '../auth/enum/role.enum';
import { ChatConverter } from './converter/chat-converter';

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
    private readonly userSpaceService: UserSpaceService,
  ) {}

  async findChatById(id: number) {
    try {
      return await this.chatTreeRepository.findOneOrFail(id, {
        relations: ['post'],
      });
    } catch (e) {
      throw new NotFoundException(`there's no chat with id: ${id}`);
    }
  }

  async findAllChats(findChatsDto: FindChatsDto, user: User) {
    const { spaceId, postId } = findChatsDto;
    const space = await this.spaceService.findSpaceById(spaceId);
    const post = await this.postService.findPostById(postId);
    const userSpace = await this.userSpaceService.findUserSpace(
      user.id,
      spaceId,
    );
    const spaceRole: SpaceRole = await Promise.resolve(userSpace.spaceRole);

    const ability = await this.caslAbilityFactory.createForUser(user, space);
    if (ability.can(Action.Read, post)) {
      const chats: Chat[] = post.chats;
      const filteredChats = chats.map((chat) => {
        if (spaceRole.role === Role.USER && chat.isAnonymous === true) {
          return ChatConverter.toFindResponseDto(chat, user);
        } else {
          return chat;
        }
      });
      return filteredChats;
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
      const chat = await this.chatRepository.save(createdChat);
      return this.chatRepository.findOne(chat.id);
    } else {
      throw new BadRequestException(
        `manager can't create chat with anonymous options or can't access with post: ${post.id}`,
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
      const chat = await this.chatRepository.save(createdChat);
      return await this.chatRepository.findOne(chat.id);
    } else {
      throw new BadRequestException(
        `manager can't create chat with anonymous options`,
      );
    }
  }

  async updateChat(updateChatDto: UpdateChatDto, user: User) {
    const { contents, spaceId, chatId } = updateChatDto;
    const space = await this.spaceService.findSpaceById(spaceId);
    const chat = await this.findChatById(chatId);
    const ability = await this.caslAbilityFactory.createForUser(user, space);
    if (
      ability.can(Action.Read, chat.post) &&
      ability.can(Action.Update, chat)
    ) {
      chat.contents = contents;
      return await this.chatRepository.save(chat);
    } else {
      throw new ForbiddenException(`can't access to chat with id: ${chatId}`);
    }
    return null;
  }
  async deleteChat(deleteChatDto: DeleteChatDto, user: User) {
    const { spaceId, chatId } = deleteChatDto;
    const space = await this.spaceService.findSpaceById(spaceId);
    const chat = await this.findChatById(chatId);
    const post = chat.post;
    const ability = await this.caslAbilityFactory.createForUser(user, space);
    if (ability.can(Action.Read, post) && ability.can(Action.Delete, chat)) {
      return this.chatRepository.softRemove(chat);
    } else {
      throw new ForbiddenException(
        `can't delete other's chat or can't access the post: ${post.id}`,
      );
    }
  }
}
