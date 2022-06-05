import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostType } from '../enum/post-type.enum';

export class NoticeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    const createPostDto: CreatePostDto = value;
    const isAnonymous = createPostDto.isAnonymous;
    const type = createPostDto.type;

    if (type === PostType.NOTICE && isAnonymous === true) {
      throw new BadRequestException(
        `notice can't write with anonymous options`,
      );
    } else {
      return value;
    }
  }
}
