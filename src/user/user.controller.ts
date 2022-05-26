import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { Public } from '../auth/decorator/skip-auth.decorator';
import { Request } from 'express';
import { SearchUserDto } from './dto/search-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserConverter } from './converter/user-converter';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get()
  findAll(): Promise<Array<User>> {
    return this.userService.findAll();
  }

  @Get('/search')
  async searchUser(@Body() searchUserDto: SearchUserDto) {
    const users: Array<User> = await this.userService.findBySearchDto(
      searchUserDto,
    );
    const userResponse: Array<UserResponseDto> = users.map((user) =>
      UserConverter.toResponseDto(user),
    );
    return userResponse;
  }

  @Get('/:id')
  findUserById(
    @Param('id') id: number,
    @Req() request: Request,
  ): Promise<User> {
    console.log(request.cookies['Authentication']);
    return this.userService.findById(id);
  }
}
