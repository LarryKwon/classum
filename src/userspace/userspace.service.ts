import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSpaceRepository } from './repository/userspace.repository';
import { User } from '../user/entity/user.entity';
import { Space } from '../space/entity/space.entity';
import { SpaceRole } from '../space-role/entity/space-role.entity';
import { EntityManager, getManager } from 'typeorm';
import { UserSpace } from './entity/userspace.entity';

@Injectable()
export class UserSpaceService {
  constructor(
    @InjectRepository(UserSpaceRepository)
    private readonly userSpaceRepository: UserSpaceRepository,
  ) {}

  async createRelations(
    user: User,
    space: Space,
    spaceRole: SpaceRole,
    transactionManager?: EntityManager,
  ) {
    let entityManager: EntityManager;
    if (transactionManager) {
      entityManager = transactionManager;
    } else {
      entityManager = await getManager();
    }
    const createdRelations = await entityManager
      .getRepository(UserSpace)
      .create();
    createdRelations.user = Promise.resolve(user);
    createdRelations.space = Promise.resolve(space);
    createdRelations.spaceRole = Promise.resolve(spaceRole);
    // Logger.log(JSON.stringify(createdRelations));
    return await entityManager.getRepository(UserSpace).save(createdRelations);
  }

  async findUserSpace(userId: number, spaceId: number) {
    return await this.userSpaceRepository.findOneOrFail({
      where: {
        user: userId,
        space: spaceId,
      },
      relations: ['space', 'spaceRole', 'user'],
    });
  }
}
