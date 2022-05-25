import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Public } from '../auth/decorator/skip-auth.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as cookieParser from 'cookie-parser';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get()
  findAll(): Promise<Array<User>> {
    return this.userService.findAll();
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/:id')
  findUser(@Param('id') id: number, @Req() request: Request): Promise<User> {
    console.log(request.cookies['Authentication']);
    return this.userService.findOne(id);
  }
}
