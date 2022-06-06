import {
  EntityManager,
  EntityRepository,
  Repository,
  TransactionManager,
} from 'typeorm';
import { User } from '../entity/user.entity';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AuthCredentialDto } from '../../auth/dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../dto/create-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(
    createUserDto: CreateUserDto,
    @TransactionManager() manager: EntityManager,
  ): Promise<User> {
    const { email, password, firstName, lastName } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await manager.create(User, {
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });
    // Logger.log(JSON.stringify(user));
    try {
      return await manager.save(user);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('already exist user');
      } else {
        // console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }
}
