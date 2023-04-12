import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Number })
  age: number;

  @Prop({ type: [String] })
  projectBoardList: string[];

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: [String] })
  recentlyViewed: string[];

  @Prop({ type: [String] })
  guestWorkSpaces: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
