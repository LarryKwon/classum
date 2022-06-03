import {
  BaseEntity,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Space } from '../../space/entity/space.entity';
import { SpaceRole } from '../../space-role/entity/space-role.entity';

@Entity()
export class UserSpace extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.userSpaces, {
    lazy: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: Promise<User>;

  @ManyToOne((type) => Space, (space) => space.userSpaces, {
    lazy: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  space: Promise<Space>;

  @ManyToOne((type) => SpaceRole, (spaceRole) => spaceRole.userSpaces, {
    lazy: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  spaceRole: Promise<SpaceRole>;

  @DeleteDateColumn()
  deletedAt?: Date;
}
