import {
  Controller,
  Get,
} from '@nestjs/common';

import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) { }

  @Get('all')
  async getAllProfiles() {
    return this.profileService.getAllProfiles();
  };

}
