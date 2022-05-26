import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../auth/enum/role.enum';
import { Space } from '../../space/entity/space.entity';
import { UserSpace } from '../../userspace/entity/userspace.entity';

@Entity()
export class SpaceRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @ManyToOne((type) => Space, (space) => space.spaceRoles, { lazy: true })
  space: Space;

  @OneToMany((type) => UserSpace, (userSpace) => userSpace.spaceRole, {
    lazy: true,
  })
  userSpaces: UserSpace[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
