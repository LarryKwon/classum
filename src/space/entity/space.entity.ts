import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserSpace } from '../../userspace/entity/userspace.entity';
import { SpaceRole } from '../../space-role/entity/space-role.entity';
import { Post } from '../../post/entity/post.entity';

@Entity()
export class Space extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  logo?: string;

  @Column('varchar', { length: 8 })
  userCode: string;

  @Column('varchar', { length: 8 })
  managerCode: string;

  @OneToMany((type) => SpaceRole, (spaceRole) => spaceRole.space, {
    eager: true,
    cascade: ['insert', 'update', 'soft-remove', 'recover'],
  })
  spaceRoles: SpaceRole[];

  @OneToMany((type) => UserSpace, (userSpace) => userSpace.space, {
    lazy: true,
    cascade: ['soft-remove', 'recover'],
  })
  userSpaces: Promise<UserSpace[]>;

  @OneToMany((type) => Post, (post) => post.space, {
    cascade: ['soft-remove', 'recover'],
  })
  posts: Post[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
