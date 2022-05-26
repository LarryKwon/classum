import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class SearchUserDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;
}
