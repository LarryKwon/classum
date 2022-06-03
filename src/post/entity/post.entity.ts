import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  writer: string;

  @Column()
  contents: string;

  @Column({ nullable: true })
  attachment: string;

  @Column()
  isAnonymous: boolean;
}
