import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceRepository } from '../space/repository/space.repository';
import { UserSpaceRepository } from '../userspace/repository/userspace.repository';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaceRepository, UserSpaceRepository]),
    CaslModule,
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
