import {
  IsString,
  IsOptional,
  MinLength,
  IsPhoneNumber,
  IsUrl,
  IsNotEmpty,
} from 'class-validator';

export class PhotoDto {
  @IsUrl()
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  @IsString()
  id: string;
}


export class EditProfileDto {
  @IsOptional()
  photo: Express.Multer.File | string | PhotoDto;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  biography?: string;

  @IsString()
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;
}