import { Injectable } from '@nestjs/common';
import { SpaceRepository } from '../space/repository/space.repository';
import { SpaceRoleRepository } from './repository/space-role.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Space } from '../space/entity/space.entity';
import { CreateSpaceRoleDto } from './dto/create-spaceRole.dto';
import { SpaceRole } from './entity/space-role.entity';

@Injectable()
export class SpaceRoleService {
  constructor(
    @InjectRepository(SpaceRoleRepository)
    private readonly spaceRoleRepository: SpaceRoleRepository,
  ) {}

  async createSpaceRole(spaceRoles: CreateSpaceRoleDto[]) {
    const createdSpaceRoles: Array<SpaceRole> = spaceRoles.map((spaceRole) =>
      this.spaceRoleRepository.create({
        name: spaceRole.name,
        role: spaceRole.role,
      }),
    );
    const savedSpaceRoles = await this.spaceRoleRepository.save(
      createdSpaceRoles,
    );
    return savedSpaceRoles;
  }

  deleteSpaceRole() {
    return true;
  }
}
