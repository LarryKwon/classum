import { Injectable, Logger } from '@nestjs/common';
import { SpaceRepository } from '../../space/repository/space.repository';
import { InjectRepository } from '@nestjs/typeorm';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PostRepository } from '../repository/post.repository';

export default function PostExists(
  validationOptions?: ValidationOptions,
  // eslint-disable-next-line @typescript-eslint/ban-types
): Function {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string): void => {
    registerDecorator({
      name: 'PostExists',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: PostExistsRule,
    });
  };
}

@ValidatorConstraint({ name: 'SpaceExists', async: true })
@Injectable()
export class PostExistsRule implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,
  ) {}

  async validate(value: any): Promise<boolean> {
    if (typeof value === 'number') {
      try {
        const post = await this.postRepository.findOneOrFail(value);
        // Logger.log(JSON.stringify(post));
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  defaultMessage(args: ValidationArguments): string {
    return `there is no post with postId: ${args.value} `;
  }
}
