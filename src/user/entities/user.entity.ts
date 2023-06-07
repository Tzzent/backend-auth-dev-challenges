import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface UserDocument extends Document {
  email: string,
  password: string | null,
  jwt_token: string | null,
  provider: string | null,
  provider_id: string | null,
}

@Schema({ timestamps: true })
export class User extends Document implements UserDocument {
  @Prop({ unique: true, sparse: true })
  email: string;

  @Prop({})
  password: string;

  @Prop({})
  jwt_token: string | null;

  @Prop({})
  provider: string | null;

  @Prop({})
  provider_id: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);