import { User } from '../../user/entity/user.entity';
import { UserResponseDto } from '../../user/dto/user-response.dto';
import { Post } from '../entity/post.entity';
import { SearchPostResDto } from '../dto/search-post-res.dto';

export class PostConverter {
  static toSearchResponseDto(post: Post, currentUser: User): SearchPostResDto {
    return new SearchPostResDto(post, currentUser);
  }
}
