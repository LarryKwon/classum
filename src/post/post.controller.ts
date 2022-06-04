import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { CheckPolicies } from '../auth/decorator/policy.decorator';
import { DeleteSpacePolicyHandler } from '../auth/guards/policy-handler/space.delete-policy.handler';
import { DeleteSpaceRoleDto } from '../space-role/dto/delete-spaceRole.dto';
import { ReadPostPolicyHandler } from '../auth/guards/policy-handler/post/post.read-policy.handler';
import { CreatePostPolicyHandler } from '../auth/guards/policy-handler/post/post.create-policy.handler';
import { CreatePostDto } from './dto/create-post.dto';
import { SearchSpaceDto } from '../space/dto/search-space.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UpdatePostPolicyHandler } from '../auth/guards/policy-handler/post/post.update-policy.handler';
import { DeletePostPolicyHandler } from '../auth/guards/policy-handler/post/post.delete-policy.handler';
import { DeletePostDto } from './dto/delete-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/search')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadPostPolicyHandler())
  searchPost(@Body() searchPostDto: SearchSpaceDto) {
    return null;
  }

  @Get('/:id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadPostPolicyHandler())
  findPostById(@Param('id') id: number, @Body('spaceId') spaceId: number) {
    return null;
  }

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CreatePostPolicyHandler())
  createPost(@Body() createPostDto: CreatePostDto) {
    return null;
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
