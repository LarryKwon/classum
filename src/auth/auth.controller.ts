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
import { User } from '../user/entity/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorator/skip-auth.decorator';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { AuthConverter } from './converter/auth-converter';
import { ProfileResponseDto } from './dto/profile-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @Post('/signup')
  @UsePipes(ValidationPipe)
  async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ProfileResponseDto> {
    // Logger.log(createUserDto);
    const user = await this.authService.signup(createUserDto);
    return AuthConverter.toResponseDto(user);
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
    // Logger.log(authCredentialDto);
    const { accessToken, ...accessOption } =
      this.authService.getCookieWithJwtAccessToken(req.user);
    const { refreshToken, ...refreshOption } =
      this.authService.getCookiesWithRefreshToken(req.user);

    await this.userService.setRefreshToken(refreshToken, user.id);
    res.cookie('Refresh', refreshToken, refreshOption);
    res.cookie('Authentication', accessToken, accessOption);
    return AuthConverter.toResponseDto(user);
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

  @Get('/profile')
  getProfile(@Req() req) {
    return AuthConverter.toResponseDto(req.user);
  }
}
