import {
  Body,
  Controller,
  Delete,
  Get,
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
import { UpdateResult } from 'typeorm';
import { JoinSpaceDto } from './dto/join-space.dto';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createSpace(@Body() createSpaceDto: CreateSpaceDto) {
    Logger.log(JSON.stringify(createSpaceDto));
    return createSpaceDto;
  }

  @Post('/join')
  joinspace(@Body() joinSpaceDto: JoinSpaceDto) {
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
