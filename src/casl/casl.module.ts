import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { SpaceModule } from '../space/space.module';
import { SpaceRoleModule } from '../space-role/space-role.module';
import { UserspaceModule } from '../userspace/userspace.module';
import { CaslAbilityFactory } from './casl-ability.factory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/repository/user.repository';
import { UserSpaceRepository } from '../userspace/repository/userspace.repository';
import { SpaceRepository } from '../space/repository/space.repository';
import { SpaceRoleRepository } from '../space-role/repository/space-role.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      UserSpaceRepository,
      SpaceRepository,
      SpaceRoleRepository,
    ]),
  ],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
