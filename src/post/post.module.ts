import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceRepository } from '../space/repository/space.repository';
import { UserSpaceRepository } from '../userspace/repository/userspace.repository';
import { CaslModule } from '../casl/casl.module';
import { PostRepository } from './repository/post.repository';
import { SpaceModule } from '../space/space.module';
import { UserSpaceService } from '../userspace/userspace.service';
import { UserspaceModule } from '../userspace/userspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostRepository,
      SpaceRepository,
      UserSpaceRepository,
    ]),
    CaslModule,
    SpaceModule,
    UserspaceModule,
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
