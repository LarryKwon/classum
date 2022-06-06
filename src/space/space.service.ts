import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpaceRepository } from './repository/space.repository';
import { CreateSpaceDto } from './dto/create-space.dto';
import { generateRandomString } from '../util/code-generator';
import { SpaceRoleService } from '../space-role/space-role.service';
import { Role } from '../auth/enum/role.enum';
import { SearchSpaceDto } from './dto/search-space.dto';
import { getManager, getRepository, In } from 'typeorm';
import { Space } from './entity/space.entity';
import { JoinSpaceDto } from './dto/join-space.dto';
import { UserSpaceService } from '../userspace/userspace.service';
import { User } from '../user/entity/user.entity';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { ExitSpaceDto } from './dto/exit-space.dto';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { Action } from '../auth/enum/Action';
import { UserSpaceRepository } from '../userspace/repository/userspace.repository';
import { UserSpace } from '../userspace/entity/userspace.entity';

@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(SpaceRepository)
    private readonly spaceRepository: SpaceRepository,
    @InjectRepository(UserSpaceRepository)
    private readonly userSpaceRepository: UserSpaceRepository,
    private readonly spaceRoleService: SpaceRoleService,
    private readonly userSpaceService: UserSpaceService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async findSpaceById(id: number) {
    try {
      return await this.spaceRepository.findOneOrFail(id);
    } catch (e) {
      throw new NotFoundException(`no space with id ${id}`);
    }
  }

  async searchSpace(searchSpaceDto: SearchSpaceDto): Promise<Array<Space>>;
  async searchSpace(code: string): Promise<Space>;
  async searchSpace(
    searchSpaceDto: SearchSpaceDto | string,
  ): Promise<Array<Space> | Space> {
    if (searchSpaceDto instanceof SearchSpaceDto) {
      const { code, ...rest } = searchSpaceDto;
      const searchedSpace: Space = await getRepository(Space)
        .createQueryBuilder('space')
        .leftJoinAndSelect('space.spaceRoles', 'spaceRole')
        .where('userCode = :userCode or managerCode = :managerCode', {
          userCode: `${searchSpaceDto.code}`,
          managerCode: `${searchSpaceDto.code}`,
        })
        .getOne();
      if (!searchedSpace) {
        throw new NotFoundException(`Can't find space that contains ${code}`);
      }
      Logger.log('searched Space: ', searchedSpace);
      return searchedSpace;
    } else if (typeof searchSpaceDto == 'string') {
      const searchedSpace: Space = await getRepository(Space)
        .createQueryBuilder()
        .where('userCode = :userCode or managerCode = :managerCode', {
          userCode: `${searchSpaceDto}`,
          managerCode: `${searchSpaceDto}`,
        })
        .getOne();
      if (!searchedSpace) {
        throw new NotFoundException(
          `Can't find space which code is ${searchSpaceDto}`,
        );
      }
      return searchedSpace;
    }
  }

  async createSpace(createSpaceDto: CreateSpaceDto, user: User) {
    const { name, spaceRoles, selectedSpaceRole } = createSpaceDto;

    const userCode: string = generateRandomString(8);
    const managerCode: string = generateRandomString(8);
    return await getManager()
      .transaction(async (manager) => {
        const savedSpaceRoles = await this.spaceRoleService.createSpaceRoles(
          spaceRoles,
          manager,
        );
        const userSpaceRole = savedSpaceRoles.find(
          (spaceRole) =>
            spaceRole.name === selectedSpaceRole.name &&
            spaceRole.role === Role.MANAGER,
        );
        const createdSpace = await manager.getRepository(Space).create({
          name: name,
          userCode: userCode,
          managerCode: managerCode,
          spaceRoles: savedSpaceRoles,
        });

        const savedSpace = await manager
          .getRepository(Space)
          .save(createdSpace);
        await this.userSpaceService.createRelations(
          user,
          savedSpace,
          userSpaceRole,
          manager,
        );
        return savedSpace;
      })
      .catch((err) => {
        throw err;
      });
  }

  async joinSpace(joinSpaceDto: JoinSpaceDto, user: User) {
    const { spaceId, code, selectedSpaceRole } = joinSpaceDto;

    return await getManager()
      .transaction(async (entityManager) => {
        //id에 해당하는 space가 있는지 검사
        const space = await entityManager
          .getRepository(Space)
          .findOne(spaceId, {
            relations: ['userSpaces'],
          });
        if (!space) {
          throw new NotFoundException(`no space with ${spaceId}`);
        }
        Logger.log('searched Space: ', JSON.stringify(space));
        //user가 이미 space에 들어와있는지 검사
        const userInSpace = await entityManager
          .getRepository(UserSpace)
          .findOne({
            where: {
              user: user,
              space: space,
            },
            relations: ['user'],
            withDeleted: true,
          });
        if (userInSpace) {
          if (userInSpace.deletedAt) {
            await entityManager.getRepository(UserSpace).recover(userInSpace);
            return await userInSpace.space;
          } else {
            throw new BadRequestException(
              `user ${user.firstName} ${user.lastName} already exists`,
            );
          }
        } else {
          //선택한 spaceRole이 존재하는지 검사
          const userSpaceRole = space.spaceRoles.find(
            (spaceRole) =>
              spaceRole.name === selectedSpaceRole.name &&
              spaceRole.role === selectedSpaceRole.role,
          );
          if (!userSpaceRole) {
            throw new NotFoundException(
              `No Role:${selectedSpaceRole.name} in this Space `,
            );
          }

          //입력한 코드와 선택한 spaceRole의 role이 같은지 검사
          if (
            (space.userCode === code && userSpaceRole.role === Role.USER) ||
            (space.managerCode === code && userSpaceRole.role === Role.MANAGER)
          ) {
            const userSpace = await this.userSpaceService.createRelations(
              user,
              space,
              userSpaceRole,
              entityManager,
            );
            return await userSpace.space;
          } else {
            throw new NotFoundException(
              `can't join space with selected spaceRole: spaceRole of with ${code} is ${userSpaceRole.role}`,
            );
          }
        }
      })
      .catch((err) => {
        throw err;
      });
  }

  async exitSpaceById(exitSpaceDto: ExitSpaceDto, user: User) {
    return await getManager()
      .transaction(async (entityManager) => {
        const { spaceId } = exitSpaceDto;
        const space = await this.findSpaceById(spaceId);
        const spaceManagerRoles = space.spaceRoles
          .filter((spaceRole) => spaceRole.role == Role.MANAGER)
          .map((item) => item.id);

        let userSpaceRole;
        let userSpace;
        try {
          userSpace = await entityManager
            .getRepository(UserSpace)
            .findOneOrFail({
              where: {
                space: space,
                user: user,
              },
            });
          userSpaceRole = await userSpace.spaceRole;
        } catch (e) {
          throw new NotFoundException(
            `user doesn't join in space with id:${spaceId}`,
          );
        }

        const numOfManagers = await entityManager
          .getRepository(UserSpace)
          .count({
            where: {
              space: space,
              spaceRole: In(spaceManagerRoles),
            },
          });
        const ability = await this.caslAbilityFactory.createForUser(
          user,
          space,
        );
        if (ability.can(Action.Exit, space)) {
          if (userSpaceRole.role === Role.MANAGER) {
            if (numOfManagers === 1) {
              throw new ForbiddenException(
                `can't exit the space because there is only one manager`,
              );
            } else {
              return await entityManager
                .getRepository(UserSpace)
                .softDelete(userSpace);
            }
          } else if (userSpaceRole.role === Role.USER) {
            return await entityManager
              .getRepository(UserSpace)
              .softDelete(userSpace.id);
          }
        } else {
          throw new ForbiddenException(`can't exit the space`);
        }
      })
      .catch((err) => {
        throw err;
      });
  }

  async updateSpaceById(updateSpaceDto: UpdateSpaceDto) {
    const { spaceId, updatedName } = updateSpaceDto;
    const space = await this.findSpaceById(spaceId);
    space.name = updatedName;
    return await this.spaceRepository.save(space);
  }

  async deleteSpaceById(id: number): Promise<Space> {
    const spaceWithId = await this.spaceRepository.findOneOrFail(id, {
      relations: ['userSpaces', 'posts'],
    });
    return await this.spaceRepository.softRemove(spaceWithId);
  }
}
