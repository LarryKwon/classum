import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from './repository/user.repository';
import { CreateUserDto } from '../auth/dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.createUser(createUserDto);
  }

  findAll(): Promise<Array<User>> {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User> {
    console.log(email);
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user) {
      throw new NotFoundException(`Can't find user with email: ${email}`);
    }
    return user;
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOne(id);
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
