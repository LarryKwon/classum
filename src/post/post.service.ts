import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from './repository/post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entity/post.entity';
import { getRepository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { SpaceService } from '../space/space.service';
import { UserSpaceService } from '../userspace/userspace.service';
import { SpaceRole } from '../space-role/entity/space-role.entity';
import { UserSpace } from '../userspace/entity/userspace.entity';
import { Role } from '../auth/enum/role.enum';
import { PostConverter } from './converter/post-converter';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { Action } from '../auth/enum/Action';
import { DeletePostDto } from './dto/delete-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,
    private readonly spaceService: SpaceService,
    private readonly userSpaceService: UserSpaceService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async afterSearch(post: Post, currentUser: User) {
    try {
      const userSpace: UserSpace = await this.userSpaceService.findUserSpace(
        currentUser.id,
        post.space.id,
      );
      const spaceRole: SpaceRole = await Promise.resolve(userSpace.spaceRole);
      if (spaceRole.role === Role.USER && post.isAnonymous === true) {
        return PostConverter.toSearchResponseDto(post, currentUser);
      } else {
        return post;
      }
    } catch (e) {
      throw new NotFoundException(
        `there's no spaceRole with user: ${currentUser.id}, space: ${post.space.id}`,
      );
    }
  }

  async findPostById(id: number) {
    try {
      return await this.postRepository.findOneOrFail(id);
    } catch (e) {
      throw new NotFoundException(`there's no post with id: ${id}`);
    }
  }

  async searchPost(keyword: string, spaceId: number) {
    const posts: Post[] = await getRepository(Post)
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.writer', 'user')
      .where(
        '(user.firstName like :firstName or user.lastName like :lastName or post.contents like :contents or post.id = :id)',
        {
          firstName: `%${keyword}%`,
          lastName: `%${keyword}%`,
          contents: `%${keyword}%`,
          id: keyword,
        },
      )
      .leftJoinAndSelect('post.space', 'space')
      .andWhere('post.space = :spaceId', {
        spaceId: spaceId,
      })
      .getMany();
    Logger.log('searched Post:', JSON.stringify(posts));
    if (posts.length == 0) {
      throw new NotFoundException(`there's no post with keyword: ${keyword}`);
    }
    return posts;
  }

  async createPost(createPostDto: CreatePostDto, user: User) {
    const { type, contents, attachment, isAnonymous, spaceId } = createPostDto;
    const space = await this.spaceService.findSpaceById(spaceId);
    const ability = await this.caslAbilityFactory.createForUser(user, space);
    const post = await this.postRepository.create({
      contents: contents,
      postType: type,
      writer: user,
      attachment: attachment,
      isAnonymous: isAnonymous,
      space: space,
    });
    if (ability.can(Action.WriteQuest, post)) {
      return await this.postRepository.save(post);
    } else {
      throw new BadRequestException(
        `manager can't create post with anonymous options`,
      );
    }
  }

  async updatePost(updatePostDto: UpdatePostDto, user: User) {
    const { spaceId, postId, contents, attachment = null } = updatePostDto;
    const space = await this.spaceService.findSpaceById(spaceId);
    let post;
    try {
      post = await this.postRepository.findOneOrFail(postId);
    } catch (e) {
      throw new NotFoundException(`there's no post with id: ${postId}`);
    }
    const ability = await this.caslAbilityFactory.createForUser(user, space);
    if (ability.can(Action.Update, post)) {
      post.contents = contents;
      post.attachment = attachment;
      return await this.postRepository.save(post);
    } else {
      throw new ForbiddenException(
        `can't access the post: ${postId} on update Execution`,
      );
    }
  }

  async deletePost(deletePostDto: DeletePostDto, currentUser?: User) {
    let post;
    try {
      post = await this.postRepository.findOneOrFail(deletePostDto.postId, {
        relations: ['chats'],
      });
    } catch (e) {
      throw new NotFoundException(
        `there's no post with id: ${deletePostDto.postId}`,
      );
    }
    if (currentUser) {
      const space = await this.spaceService.findSpaceById(
        deletePostDto.spaceId,
      );
      const ability = await this.caslAbilityFactory.createForUser(
        currentUser,
        space,
      );
      if (ability.can(Action.Delete, post)) {
        return this.postRepository.softRemove(post);
      } else {
        throw new ForbiddenException(
          `can't delete other's post or can't access post:${post.id}`,
        );
      }
    } else {
      return this.postRepository.softRemove(post);
    }
  }
}
