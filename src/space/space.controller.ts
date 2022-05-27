import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { SearchSpaceDto } from './dto/search-space.dto';
import { User } from '../user/entity/user.entity';
import { JoinSpaceDto } from './dto/join-space.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { UserSpaceService } from '../userspace/userspace.service';

@Controller('space')
export class SpaceController {
  constructor(
    private readonly spaceService: SpaceService,
    private readonly userSpaceService: UserSpaceService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createSpace(
    @Body() createSpaceDto: CreateSpaceDto,
    @GetUser() user: User,
  ) {
    Logger.log(JSON.stringify(createSpaceDto));
    if (!createSpaceDto.isSelectInSpaceRoles()) {
      throw new BadRequestException('select role must be in role list');
    }
    const { savedSpace, userSpaceRole } = await this.spaceService.createSpace(
      createSpaceDto,
    );
    await this.userSpaceService.createRelations(
      user,
      savedSpace,
      userSpaceRole,
    );
    return savedSpace;
  }

  @Post('/join')
  joinSpace(@Body() joinSpaceDto: JoinSpaceDto) {
    return null;
  }

  @Get('/search')
  @UsePipes(ValidationPipe)
  searchSpace(@Body() searchSpaceDto: SearchSpaceDto) {
    return null;
  }

  @Get('/:id')
  findSpaceById(@Param('id') id: number) {
    return null;
  }

  @Delete('/:id')
  deleteSpace(@Param('id') id: number) {
    return null;
  }
}
