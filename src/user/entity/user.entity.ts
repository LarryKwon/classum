import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserSpace } from '../../userspace/entity/userspace.entity';
import { Post } from '../../post/entity/post.entity';
import { Chat } from '../../chat/entity/chat.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  lastName: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  profilePicture?: string;

  @Exclude()
  @Column({ nullable: true })
  RefreshToken?: string;

  @OneToMany((type) => UserSpace, (userSpace) => userSpace.user, {
    lazy: true,
    cascade: ['insert', 'update', 'soft-remove', 'recover'],
  })
  userSpaces: Promise<UserSpace[]>;

  @OneToMany((type) => Post, (post) => post.writer, {
    eager: false,
    cascade: ['insert', 'update', 'soft-remove', 'recover'],
  })
  posts: Post[];

  @OneToMany((type) => Chat, (chat) => chat.writer, {
    eager: false,
    cascade: ['insert', 'update', 'soft-remove', 'recover'],
  })
  chats: Chat[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
