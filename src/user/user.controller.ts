import {
  Body,
  Controller,
  Get,
  Res,
  Delete,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { GetUser } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guards';
import { multerOptions } from 'src/user/utils/multerOptions';
import { EditUserDto } from './dtos/edit-user.dto';
import { UserDocument } from './entities/user.entity';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get('me')
  async getMe(@GetUser() user: UserDocument) {
    return await this.userService.getUserById(user._id);
  }

  @Patch('me')
  @UseInterceptors(FileInterceptor('photo', multerOptions))
  async updateUser(
    @GetUser() user: UserDocument,
    @Body() dto: EditUserDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return await this.userService.updateUser(user, dto, photo);
  };

  @Delete('me')
  async deleteUser(
    @GetUser() user: UserDocument,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.userService.deleteUser(user._id);
    res.clearCookie('access_token', {
      domain: '.railway.app',
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
    });
  }
}
