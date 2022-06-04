import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSpaceRepository } from './repository/userspace.repository';
import { User } from '../user/entity/user.entity';
import { Space } from '../space/entity/space.entity';
import { SpaceRole } from '../space-role/entity/space-role.entity';

@Injectable()
export class UserSpaceService {
  constructor(
    @InjectRepository(UserSpaceRepository)
    private readonly userSpaceRepository: UserSpaceRepository,
  ) {}

  async createRelations(user: User, space: Space, spaceRole: SpaceRole) {
    const createdRelations = await this.userSpaceRepository.create();
    createdRelations.user = Promise.resolve(user);
    createdRelations.space = Promise.resolve(space);
    createdRelations.spaceRole = Promise.resolve(spaceRole);
    Logger.log(JSON.stringify(createdRelations));
    return await this.userSpaceRepository.save(createdRelations);
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
