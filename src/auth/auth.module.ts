import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/repository/user.repository';
import { UserModule } from '../user/user.module';
import { JwtConfigService } from '../config/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { SpaceModule } from '../space/space.module';
import { SpaceRoleModule } from '../space-role/space-role.module';
import { UserspaceModule } from '../userspace/userspace.module';
import { CaslModule } from 'nest-casl';
import { Roles } from './decorator/roles.decorator';
import { Role } from './enum/role.enum';
import { UserSpaceRepository } from '../userspace/repository/userspace.repository';
import { SpaceRoleRepository } from '../space-role/repository/space-role.repository';
import { SpaceRepository } from '../space/repository/space.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    TypeOrmModule.forFeature([
      UserRepository,
      UserSpaceRepository,
      SpaceRoleRepository,
      SpaceRepository,
    ]),
    UserModule,
    SpaceModule,
    SpaceRoleModule,
    UserspaceModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
