import { Space } from '../entity/space.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Space)
export class SpaceRepository extends Repository<Space> {}
