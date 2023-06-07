import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserDocument } from 'src/user/entities/user.entity';

export interface IPhoto {
  id: string,
  url: string,
}

export interface ProfileDocument extends Document {
  photo?: IPhoto,
  name: string,
  biography?: string,
  phone?: string | null,
  user: Types.ObjectId,
}

export type ProfileDocumentWithUser = Pick<
  ProfileDocument,
  Exclude<keyof ProfileDocument, 'user'>
> & {
  user: UserDocument;
};


@Schema({ timestamps: true })
export class Profile extends Document implements ProfileDocument {
  @Prop({
    type: Object,
    required: true,
    default: {
      url: 'https://isobarscience-1bfd8.kxcdn.com/wp-content/uploads/2020/09/default-profile-picture1.jpg',
    }
  })
  photo: {
    url: string,
    id: string,
  }

  @Prop({
    required: true,
    default: 'New User 😴'
  })
  name: string;

  @Prop({
    required: true,
    default: 'Hello! I am a new user and I would like to meet new people. 😎'
  })
  biography: string;

  @Prop()
  phone: string | null;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  user: Types.ObjectId;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);