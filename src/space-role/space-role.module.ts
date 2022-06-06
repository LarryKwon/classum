import { Module } from '@nestjs/common';
import { SpaceRoleService } from './space-role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceRoleRepository } from './repository/space-role.repository';
import { SpaceRoleController } from './space-role.controller';
import { UserSpaceRepository } from '../userspace/repository/userspace.repository';
import { UserspaceModule } from '../userspace/userspace.module';
import { CaslModule } from '../casl/casl.module';
import { SpaceRepository } from '../space/repository/space.repository';
import { SpaceExistsRule } from './decorator/space-exists.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SpaceRoleRepository,
      UserSpaceRepository,
      SpaceRepository,
    ]),
    UserspaceModule,
    CaslModule,
  ],
  providers: [SpaceRoleService, SpaceExistsRule],
  controllers: [SpaceRoleController],
  exports: [SpaceRoleService, SpaceExistsRule],
})
export class SpaceRoleModule {}
