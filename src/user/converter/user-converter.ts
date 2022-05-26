import { UserResponseDto } from '../dto/user-response.dto';
import { User } from '../entity/user.entity';

export class EntityToDtoConverter {
  static toResponseDto(user: User): UserResponseDto {
    const {
      id,
      lastName,
      firstName,
      profilePicture = null,
      deletedAt = null,
    } = user;
    return new UserResponseDto(
      id,
      lastName,
      firstName,
      profilePicture,
      deletedAt,
    );
  }
}
