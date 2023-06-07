import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  Matches,
} from 'class-validator';

export interface IAuthDto {
  email: string,
  password?: string | null,
}

export class SignupDto implements IAuthDto {
  @Matches(/^(?!.*@(?:gmail|hotmail|outlook)\.com).*$/, {
    message: 'Email contains a restricted domain',
  })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string | null;
}


export class SigninDto implements IAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string | null;
}