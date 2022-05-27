import { Module } from '@nestjs/common';
import { SpaceController } from './space.controller';
import { SpaceService } from './space.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceRepository } from './repository/space.repository';
import { SpaceRoleRepository } from '../space-role/repository/space-role.repository';
import { SpaceRoleService } from '../space-role/space-role.service';
import { SpaceRoleModule } from '../space-role/space-role.module';
import { UserspaceModule } from '../userspace/userspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaceRepository]),
    SpaceRoleModule,
    UserspaceModule,
  ],
  controllers: [SpaceController],
  providers: [SpaceService],
  exports: [SpaceService],
})
export class SpaceModule {}
