import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuards } from './guards/local-auth.guards';
import { User } from '../user/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorator/skip-auth.decorator';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @Post('/signup')
  @UsePipes(ValidationPipe)
  signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    Logger.log(createUserDto);
    return this.authService.signup(createUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuards)
  @Post('/login')
  async logIn(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto,
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user;
    Logger.log(authCredentialDto);
    const { accessToken, ...accessOption } =
      this.authService.getCookieWithJwtAccessToken(req.user);
    const { refreshToken, ...refreshOption } =
      this.authService.getCookiesWithRefreshToken(req.user);

    await this.userService.setRefreshToken(refreshToken, user.id);
    res.cookie('Authentication', accessToken, accessOption);
    res.cookie('Refresh', refreshToken, refreshOption);
  }

  @Post('logout')
  async logOut(@Res({ passthrough: true }) res: Response) {
    const { accessOption, refreshOption } =
      await this.authService.getCookiesForLogOut();
    res.cookie('Authentication', '', accessOption);
    res.cookie('Refresh', '', refreshOption);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = req.user;
    const { accessToken, ...accessOption } =
      this.authService.getCookieWithJwtAccessToken(user);
    res.cookie('Authentication', accessToken, accessOption);
    return user;
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
