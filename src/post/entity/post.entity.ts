import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Space } from '../../space/entity/space.entity';
import { Chat } from '../../chat/entity/chat.entity';
import { Exclude } from 'class-transformer';
import { User } from '../../user/entity/user.entity';

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.posts, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  writer: User;

  @Column()
  contents: string;

  @Column({ nullable: true })
  attachment: string;

  @Column()
  isAnonymous: boolean;

  @ManyToOne((type) => Space, (space) => space.posts, {
    eager: true,
    onDelete: 'CASCADE',
  })
  space: Space;

  @OneToMany((type) => Chat, (chat) => chat.post, {
    eager: true,
    cascade: ['soft-remove', 'recover'],
  })
  chats: Chat[];
}
