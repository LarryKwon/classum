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

@Entity()
// @Unique(['email'])
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

  @OneToMany((type) => UserSpace, (userSpace) => userSpace.user, { lazy: true })
  userSpaces: Promise<UserSpace[]>;

  @DeleteDateColumn()
  deletedAt?: Date;
}
