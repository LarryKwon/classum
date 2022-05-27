import { Module } from '@nestjs/common';
import { SpaceRoleService } from './space-role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceRoleRepository } from './repository/space-role.repository';
import { SpaceRoleController } from './space-role.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SpaceRoleRepository])],
  providers: [SpaceRoleService],
  controllers: [SpaceRoleController],
  exports: [SpaceRoleService],
})
export class SpaceRoleModule {}
