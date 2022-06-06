import { Module } from '@nestjs/common';
import { SpaceController } from './space.controller';
import { SpaceService } from './space.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceRepository } from './repository/space.repository';
import { SpaceRoleRepository } from '../space-role/repository/space-role.repository';
import { SpaceRoleService } from '../space-role/space-role.service';
import { SpaceRoleModule } from '../space-role/space-role.module';
import { UserspaceModule } from '../userspace/userspace.module';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { CaslModule } from '../casl/casl.module';
import { UserSpaceRepository } from '../userspace/repository/userspace.repository';
import { SpaceExistsRule } from '../space-role/decorator/space-exists.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaceRepository, UserSpaceRepository]),
    SpaceRoleModule,
    UserspaceModule,
    CaslModule,
  ],
  controllers: [SpaceController],
  providers: [SpaceService, SpaceExistsRule],
  exports: [SpaceService],
})
export class SpaceModule {}
