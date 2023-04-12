import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Task } from '../task/task.schema';

export type CardDocument = HydratedDocument<Card>;
@Schema({ timestamps: true })
export class Card {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ schema: [Task] })
  taskList: Task[];

  @Prop({ type: [String] })
  img_source: string[];

  @Prop({ type: [String] })
  discribe: string[];

  @Prop({ type: String })
  idBoard: string;
}
export const CardSchema = SchemaFactory.createForClass(Card);
