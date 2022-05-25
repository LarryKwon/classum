import {
  BaseEntity,
  DeleteDateColumn,
  Entity,
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

  @ManyToOne((type) => User, (user) => user.userSpaces, { lazy: true })
  user: User;

  @ManyToOne((type) => Space, (space) => space.userSpaces, { lazy: true })
  space: Space;

  @ManyToOne((type) => SpaceRole, (spaceRole) => spaceRole.userSpaces, {
    lazy: true,
  })
  spaceRole: SpaceRole;

  @DeleteDateColumn()
  deletedAt?: Date;
}
