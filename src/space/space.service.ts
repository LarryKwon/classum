import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpaceRepository } from './repository/space.repository';
import { CreateSpaceDto } from './dto/create-space.dto';
import { generateRandomString } from '../util/code-generator';
import { SpaceRoleService } from '../space-role/space-role.service';
import { Role } from '../auth/enum/role.enum';
import { SearchSpaceDto } from './dto/search-space.dto';
import { getRepository } from 'typeorm';
import { Space } from './entity/space.entity';

@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(SpaceRepository)
    private readonly spaceRepository: SpaceRepository,
    private readonly spaceRoleService: SpaceRoleService,
  ) {}

  async createSpace(createSpaceDto: CreateSpaceDto) {
    const { name, spaceRoles, selectedSpaceRole } = createSpaceDto;

    const userCode: string = generateRandomString(8);
    const managerCode: string = generateRandomString(8);

    const savedSpaceRoles = await this.spaceRoleService.createSpaceRole(
      spaceRoles,
    );
    const userSpaceRole = savedSpaceRoles.find(
      (spaceRole) =>
        spaceRole.name === selectedSpaceRole.name &&
        spaceRole.role === Role.MANAGER,
    );
    const createdSpace = this.spaceRepository.create({
      name: name,
      userCode: userCode,
      managerCode: managerCode,
      spaceRoles: savedSpaceRoles,
    });

    const savedSpace = await this.spaceRepository.save(createdSpace);

    return { savedSpace, userSpaceRole };
  }

  async searchSpace(searchSpaceDto: SearchSpaceDto) {
    const { name, ...rest } = searchSpaceDto;
    const searchedSpaces = await getRepository(Space)
      .createQueryBuilder()
      .where('name like :name', {
        name: `%${name}%`,
      })
      .getMany();
    Logger.log('searched Space: ', searchedSpaces);
    return searchedSpaces;
  }
}
