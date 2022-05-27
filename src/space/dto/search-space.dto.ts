import { IsString } from 'class-validator';

export class SearchSpaceDto {
  @IsString()
  code: string;
}
