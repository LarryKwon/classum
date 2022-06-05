import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRepository } from './repository/chat.repository';
import { PostRepository } from '../post/repository/post.repository';
import { SpaceRepository } from '../space/repository/space.repository';
import { CaslModule } from '../casl/casl.module';
import { SpaceModule } from '../space/space.module';
import { PostModule } from '../post/post.module';
import { ChatTreeRepository } from './repository/chat.tree-repository';
import { UserSpaceRepository } from '../userspace/repository/userspace.repository';
import { ChatExistsRule } from './decorator/chat-exists.validator';
import { UserspaceModule } from '../userspace/userspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatRepository,
      ChatTreeRepository,
      PostRepository,
      SpaceRepository,
      UserSpaceRepository,
    ]),
    CaslModule,
    SpaceModule,
    PostModule,
    UserspaceModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatExistsRule],
  exports: [ChatService, ChatExistsRule],
})
export class ChatModule {}
