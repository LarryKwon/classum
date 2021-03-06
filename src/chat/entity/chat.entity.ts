import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Space } from '../../space/entity/space.entity';
import { Post } from '../../post/entity/post.entity';
import { User } from '../../user/entity/user.entity';

@Entity()
@Tree('materialized-path')
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

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne((type) => Post, (post) => post.chats, {
    eager: false,
    onDelete: 'CASCADE',
  })
  post: Post;

  @TreeChildren()
  children: Chat[];

  @TreeParent()
  parent: Chat;
}
