import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { getManager, getRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from './repository/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserDto } from './dto/search-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await getManager()
      .transaction(async (manager) => {
        return await this.userRepository.createUser(createUserDto, manager);
      })
      .catch((err) => {
        throw err;
      });
  }

  async findAll(): Promise<Array<User>> {
    return await getManager()
      .transaction(async (manager) => {
        return await this.userRepository.find();
      })
      .catch((err) => {
        throw err;
      });
  }

  async findByEmail(email: string): Promise<User> {
    console.log(email);
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user) {
      throw new NotFoundException(`Can't find user with email: ${email}`);
    }
    return user;
  }

  async findBySearchDto(searchUserDto: SearchUserDto): Promise<User[]> {
    Logger.log(searchUserDto);
    const { firstName = '', lastName = '' } = searchUserDto;

    const users = await getRepository(User)
      .createQueryBuilder()
      .where('firstName like :firstName and lastName like :lastName', {
        firstName: `%${firstName}%`,
        lastName: `%${lastName}%`,
      })
      .getMany();
    Logger.log(JSON.stringify(users));
    return users;
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async setRefreshToken(refreshToken: string, id: number) {
    const salt = await bcrypt.genSalt();
    const currentBcryptRefreshToken = await bcrypt.hash(refreshToken, salt);
    await this.userRepository.update(id, {
      RefreshToken: currentBcryptRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, email: string) {
    const user = await this.findByEmail(email);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.RefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(id: number) {
    return this.userRepository.update(id, {
      RefreshToken: null,
    });
  }
}
