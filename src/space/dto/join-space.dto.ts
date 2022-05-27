import { IsString } from 'class-validator';

export class JoinSpaceDto {
  @IsString()
  code: string;
}
