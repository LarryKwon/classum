import { EntityRepository, Repository, TreeRepository } from 'typeorm';
import { Chat } from '../entity/chat.entity';

@EntityRepository(Chat)
export class ChatTreeRepository extends TreeRepository<Chat> {}
