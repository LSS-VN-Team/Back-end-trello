import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CardDocument = HydratedDocument<Card>;
@Schema()
export class Card {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: [String] })
  taskList: string[];

  @Prop({ type: [String] })
  img_source: string[];

  @Prop({ type: [String] })
  discribe: string[];
}
export const CardSchema = SchemaFactory.createForClass(Card);