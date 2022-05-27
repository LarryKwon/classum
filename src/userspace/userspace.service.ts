import { Injectable } from '@nestjs/common';
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
    const createdRelations = this.userSpaceRepository.create({
      user: user,
      space: space,
      spaceRole: spaceRole,
    });
    return await this.userSpaceRepository.save(createdRelations);
  }
}
