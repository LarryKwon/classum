import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRepository } from '../repository/chat.repository';

export default function ChatExists(
  validationOptions?: ValidationOptions,
  // eslint-disable-next-line @typescript-eslint/ban-types
): Function {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string): void => {
    registerDecorator({
      name: 'ChatExists',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: ChatExistsRule,
    });
  };
}

@ValidatorConstraint({ name: 'SpaceExists', async: true })
@Injectable()
export class ChatExistsRule implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(ChatRepository)
    private readonly chatRepository: ChatRepository,
  ) {}

  async validate(value: any): Promise<boolean> {
    if (typeof value === 'number') {
      try {
        const chat = await this.chatRepository.findOneOrFail(value);
        // Logger.log(JSON.stringify(chat));
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
