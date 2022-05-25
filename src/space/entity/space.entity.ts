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

@Entity()
export class Space extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  logo: string;

  @OneToMany((type) => SpaceRole, (spaceRole) => spaceRole.space, {
    lazy: true,
  })
  spaceRoles: SpaceRole[];

  @OneToMany((type) => UserSpace, (userSpace) => userSpace.space, {
    lazy: true,
  })
  userSpaces: UserSpace[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
