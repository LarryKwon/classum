import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Space } from '../../space/entity/space.entity';
import { Post } from '../../post/entity/post.entity';
import { User } from '../../user/entity/user.entity';

@Entity()
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.chats, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  writer: User;

  @Column()
  contents: string;

  @Column()
  isAnonymous: boolean;

  @ManyToOne((type) => Post, (post) => post.chats, {
    eager: false,
    onDelete: 'CASCADE',
  })
  post: Post;
}
