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
import { PostExistsRule } from './decorator/post-exists.validator';

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
    PostModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostExistsRule],
  exports: [PostService, PostExistsRule],
})
export class PostModule {}
