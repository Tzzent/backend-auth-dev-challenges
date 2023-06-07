import {
  IsString,
  IsOptional,
  MinLength,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateProfileDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  biography?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsMongoId()
  @IsNotEmpty()
  user_id: Types.ObjectId;
}