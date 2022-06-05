import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      secretOrKey: configService.get('jwt.secret'),
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.Authentication;
        },
      ]),
    });
  }

  async validate(payload) {
    // console.log(payload);
    return this.userService.findByEmail(payload.email);
  }
}
