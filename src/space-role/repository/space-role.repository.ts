import { EntityRepository, Repository } from 'typeorm';
import { SpaceRole } from '../entity/space-role.entity';

@EntityRepository(SpaceRole)
export class SpaceRoleRepository extends Repository<SpaceRole> {}
