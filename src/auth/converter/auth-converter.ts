import { User } from '../../user/entity/user.entity';
import { UserResponseDto } from '../../user/dto/user-response.dto';
import { ProfileResponseDto } from '../dto/profile-response.dto';

export class AuthConverter {
  static toResponseDto(user: User): ProfileResponseDto {
    const {
      id,
      email,
      lastName,
      firstName,
      profilePicture = null,
      deletedAt = null,
    } = user;
    return new ProfileResponseDto(
      id,
      email,
      lastName,
      firstName,
      profilePicture,
      deletedAt,
    );
  }
}
