import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
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

  @ManyToOne((type) => Space, (space) => space.spaceRoles, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  space: Space;

  @OneToMany((type) => UserSpace, (userSpace) => userSpace.spaceRole, {
    lazy: true,
    cascade: ['soft-remove', 'recover'],
  })
  userSpaces: Promise<UserSpace[]>;

  @DeleteDateColumn()
  deletedAt?: Date;
}
