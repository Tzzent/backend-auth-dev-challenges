import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { ProfileService } from 'src/profile/profile.service';
import { EditUserDto } from './dtos/edit-user.dto';
import { UserDocument, UserSchema } from './entities/user.entity';
import { ProfileDocument, ProfileDocumentWithUser, ProfileSchema } from 'src/profile/entities/profile.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<typeof UserSchema>,
    @InjectModel('Profile') private profileModel: Model<typeof ProfileSchema>,
    private profileService: ProfileService,
    private cloudinaryService: CloudinaryService,
  ) { }


  // async create(user: UserSchema): Promise<UserSchema> {
  //   const newUser = new this.userModel(user);
  //   return newUser.save();
  // }

  async getUserById(id: string) {
    const profile: ProfileDocumentWithUser = await this.profileModel.findOne({
      user: new Types.ObjectId(id),
    }).populate('user');

    if (!profile) {
      throw new ForbiddenException('This profile does not exist');
    }

    const { user: { email }, ...profileData } = profile.toObject();

    return {
      ...profileData,
      email
    };
  };

  async updateUser(
    user: UserDocument,
    dto: EditUserDto,
    photo: Express.Multer.File,
  ) {

    try {
      if (user.email !== dto.email) {
        const emailRegex = /^(?!.*@(?:gmail|hotmail|outlook)\.com).*$/;
        if (!emailRegex.test(dto.email)) {
          throw new ForbiddenException('This email is not valid');
        }
      }

      if (dto.password) {
        dto.password = await bcrypt.hash(dto.password, 10);
      }

      const updatedUser = await this.userModel.findByIdAndUpdate(user._id, {
        ...dto,
      }, { new: true });

      if (!updatedUser) {
        throw new ForbiddenException('This user does not exist');
      }

      const profileData = { ...dto };
      delete profileData.email;
      delete profileData.password;

      const updatedProfile = await this.profileService.updateProfile(
        user._id,
        profileData,
        photo
      );

      return {
        user: updatedUser,
        profile: updatedProfile,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new ForbiddenException('Email is already taken');
      }

      throw new ForbiddenException(error.message);
    }
  };

  async deleteUser(userId: Types.ObjectId) {
    const deletedProfile: ProfileDocument = await this.profileModel.findOneAndDelete({
      user: userId,
    }, { new: true });

    if (!deletedProfile) {
      throw new ForbiddenException('This profile does not exist');
    }

    if (deletedProfile.photo.id) {
      await this.cloudinaryService.deleteImage(deletedProfile.photo.id);
    }
    
    await this.userModel.findByIdAndDelete(userId);

    return {
      msg: 'The user has been deleted successfully!',
    };
  }

}
