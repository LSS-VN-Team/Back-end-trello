import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  img: string;

  @Prop({ type: String })
  idCard: string;

  @Prop({ type: [String] })
  follower: string[];

  @Prop({ type: [String] })
  descrip: string;

  @Prop({ type: String })
  attach: string[];

  @Prop({ type: [String] })
  joinner: string[];

  @Prop({ type: [String] })
  commentList: string[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
