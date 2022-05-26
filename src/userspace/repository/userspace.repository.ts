import { EntityRepository, Repository } from 'typeorm';
import { UserSpace } from '../entity/userspace.entity';

@EntityRepository(UserSpace)
export class UserspaceRepository extends Repository<UserSpace> {}
