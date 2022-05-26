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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as cookieParser from 'cookie-parser';
import { Request } from 'express';
import { SearchUserDto } from './dto/search-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get()
  findAll(): Promise<Array<User>> {
    return this.userService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/search')
  @UsePipes(ValidationPipe)
  searchUser(@Body() searchUserDto: SearchUserDto) {
    return this.userService.findBySearchDto(searchUserDto);
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
