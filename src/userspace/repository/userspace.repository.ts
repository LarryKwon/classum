import { EntityRepository, Repository } from 'typeorm';
import { UserSpace } from '../entity/userspace.entity';

@EntityRepository(UserSpace)
export class UserSpaceRepository extends Repository<UserSpace> {}
