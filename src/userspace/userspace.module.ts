import { Module } from '@nestjs/common';
import { UserSpaceService } from './userspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSpaceRepository } from './repository/userspace.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserSpaceRepository])],
  providers: [UserSpaceService],
  exports: [UserSpaceService],
})
export class UserspaceModule {}
