import { EntityRepository, Repository } from 'typeorm';
import { User } from '../user.entity';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AuthCredentialDto } from '../../auth/dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../../auth/dto/create-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, firstName, lastName } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });
    Logger.log(JSON.stringify(user));
    try {
      return await this.save(user);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('already exist user');
      } else {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }
}
