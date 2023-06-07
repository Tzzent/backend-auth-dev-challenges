import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { EditProfileDto } from './dtos/edit-profile.dto';
import { ProfileSchema } from './entities/profile.entity';


@Injectable()
export class ProfileService {
  constructor(
    private cloudinaryService: CloudinaryService,
    @InjectModel('Profile') private profileModel: Model<typeof ProfileSchema>,
  ) { }

  async getAllProfiles() {
    return await this.profileModel
      .find()
      .populate({ path: 'user', select: 'email' });
  };

  async updateProfile(
    id: Types.ObjectId,
    dto: EditProfileDto,
    photo: Express.Multer.File,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ForbiddenException('Invalid ID');
    }

    const profile: any = await this.profileModel.findOne({
      user: new Types.ObjectId(id),
    });

    if (!profile) {
      throw new ForbiddenException('This profile does not exist!');
    }

    try {
      if (photo) { // -> If the user sends us a photo
        if (profile.photo?.id) { // -> We check if the user already has a photo in cloudinary, and destroy it
          await this.cloudinaryService.deleteImage(profile.photo.id);
        }

        const {
          url: newImageUrl,
          id: newImageId,
        } = await this.cloudinaryService.uploadImage(photo); // -> We upload the photo

        dto.photo = { // -> We update the photo
          url: newImageUrl,
          id: newImageId,
        };
      }

      const updatedProfile = await this.profileModel.findByIdAndUpdate(profile._id, { // -> We update the profile
        $set: {
          ...dto,
        }
      }, {
        new: true,
      });

      return updatedProfile;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  };
}
