import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable, Logger } from '@nestjs/common';
import { SpaceRepository } from '../../space/repository/space.repository';
import { InjectRepository } from '@nestjs/typeorm';

export default function SpaceExists(
  validationOptions?: ValidationOptions,
  // eslint-disable-next-line @typescript-eslint/ban-types
): Function {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string): void => {
    registerDecorator({
      name: 'SpaceExists',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: SpaceExistsRule,
    });
  };
}

@ValidatorConstraint({ name: 'SpaceExists', async: true })
@Injectable()
export class SpaceExistsRule implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(SpaceRepository)
    private readonly spaceRepository: SpaceRepository,
  ) {}

  async validate(value: any): Promise<boolean> {
    if (typeof value === 'number') {
      try {
        const space = await this.spaceRepository.findOneOrFail(value);
        // Logger.log(JSON.stringify(space));
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  defaultMessage(args: ValidationArguments): string {
    return `there is no space with spaceId: ${args.value} `;
  }
}
