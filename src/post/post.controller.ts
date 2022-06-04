import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { CheckPolicies } from '../auth/decorator/policy.decorator';
import { ReadPostPolicyHandler } from '../auth/guards/policy-handler/post/post.read-policy.handler';
import { CreateQuestPolicyHandler } from '../auth/guards/policy-handler/post/post.createQuest-policy.handler';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UpdatePostPolicyHandler } from '../auth/guards/policy-handler/post/post.update-policy.handler';
import { DeletePostPolicyHandler } from '../auth/guards/policy-handler/post/post.delete-policy.handler';
import { DeletePostDto } from './dto/delete-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '../user/entity/user.entity';
import { CreateNoticePolicyHandler } from '../auth/guards/policy-handler/post/post.createNotice-policy.handler';
import { PostType } from './enum/post-type.enum';
import { NoticeValidationPipe } from './pipes/post-status-validation.pipe';
import { PostConverter } from './converter/post-converter';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/search')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadPostPolicyHandler())
  async searchPost(
    @Body() searchPostDto: SearchPostDto,
    @GetUser() user: User,
  ) {
    const searchedPosts = await this.postService.searchPost(
      searchPostDto.keyword,
      searchPostDto.spaceId,
    );
    const filteredPosts = Promise.all(
      searchedPosts.map(
        async (post) => await this.postService.afterSearch(post, user),
      ),
    );
    return filteredPosts;
  }

  @Get('/:id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadPostPolicyHandler())
  async findPostById(@Param('id') id: number, @GetUser() user: User) {
    const post = await this.postService.findPostById(id);
    return await this.postService.afterSearch(post, user);
  }

  @Post('/quest')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CreateQuestPolicyHandler())
  createNotice(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
    const type = createPostDto.type;
    if (type !== PostType.QUEST) {
      throw new BadRequestException(`write post with type quest, now: ${type}`);
    }
    return this.postService.createPost(createPostDto, user);
  }

  @Post('/notice')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CreateNoticePolicyHandler())
  createQuest(
    @Body(NoticeValidationPipe) createPostDto: CreatePostDto,
    @GetUser() user: User,
  ) {
    const type = createPostDto.type;
    if (type !== PostType.NOTICE) {
      throw new BadRequestException(
        `write post with type notice, now: ${type}`,
      );
    }
    return this.postService.createPost(createPostDto, user);
  }

  @Patch('/:id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new UpdatePostPolicyHandler())
  updateBoard(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    return null;
  }

  @Delete()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new DeletePostPolicyHandler())
  deleteSpaceRole(@Body() deletePostDto: DeletePostDto) {
    return null;
  }
}
