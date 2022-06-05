import { EntityRepository, Repository } from 'typeorm';
import { Post } from '../../post/entity/post.entity';
import { Chat } from '../entity/chat.entity';

@EntityRepository(Chat)
export class ChatRepository extends Repository<Chat> {}
