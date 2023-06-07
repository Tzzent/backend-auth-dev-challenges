import {
  IsEmail,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';
import { EditProfileDto } from 'src/profile/dtos/edit-profile.dto';


export class EditUserDto extends EditProfileDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsStrongPassword()
  password?: string;
}