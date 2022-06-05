import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SpaceRepository } from '../space/repository/space.repository';
import { SpaceRoleRepository } from './repository/space-role.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSpaceRoleDto } from './dto/create-spaceRole.dto';
import { SpaceRole } from './entity/space-role.entity';
import { DeleteSpaceRoleDto } from './dto/delete-spaceRole.dto';
import { FindOneOptions } from 'typeorm';

@Injectable()
export class SpaceRoleService {
  constructor(
    @InjectRepository(SpaceRepository)
    private readonly spaceRepository: SpaceRepository,
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

  async findSpaceRole(
    spaceId: number,
    options?: FindOneOptions,
  ): Promise<SpaceRole[]> {
    try {
      const space = await this.spaceRepository.findOneOrFail(spaceId, options);
      return space.spaceRoles;
    } catch (e) {
      throw new NotFoundException(`there's no space with spaceId: ${spaceId}`);
    }
  }

  async deleteSpaceRole(deleteSpaceRoleDto: DeleteSpaceRoleDto) {
    const spaceId: number = deleteSpaceRoleDto.spaceId;
    const spaceRoles = await this.findSpaceRole(spaceId);
    Logger.log(JSON.stringify(spaceRoles));
    //역할이 한 개 이상 있어야하는지
    const typeOfRoles = new Set();
    spaceRoles.forEach((spaceRole) => typeOfRoles.add(spaceRole.role));
    if (typeOfRoles.size <= 2) {
      throw new BadRequestException(`there must be one role at least`);
    }
    //삭제하려는 역할이 존재하는지
    const spaceRole = spaceRoles.find((spaceRole) => {
      console.log(deleteSpaceRoleDto.spaceRole.role);
      console.log(deleteSpaceRoleDto.spaceRole.name);
      return (
        spaceRole.role === deleteSpaceRoleDto.spaceRole.role &&
        spaceRole.name === deleteSpaceRoleDto.spaceRole.name
      );
    });
    //있다면
    if (spaceRole) {
      const userSpace = await spaceRole.userSpaces;
      Logger.log(JSON.stringify(userSpace));
      if (userSpace.length) {
        throw new BadRequestException(
          `there are users with role: ${spaceRole.role} ${spaceRole.name}`,
        );
      } else {
        return await this.spaceRoleRepository.softDelete(spaceRole.id);
      }
    } //없다면
    else {
      const { role, name } = deleteSpaceRoleDto.spaceRole;
      throw new NotFoundException(
        `there's no spaceRole: role: ${role}, name: ${name}`,
      );
    }
  }
}
