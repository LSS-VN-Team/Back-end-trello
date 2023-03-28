import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ type: String, required: true})
  title: string;

  @Prop({type: String})
  img: string;

  @Prop({type: [String]})
  follower: String[];

  @Prop({type: [String]})
  descrip: String;

  @Prop({type: String})
  attach: String[];

  @Prop({type: [String]})
  joinner: String[];
  
  @Prop({ type: [String]})
  comment: string[];

}

export const TaskSchema = SchemaFactory.createForClass(Task);
