import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BoardDocument = HydratedDocument<Board>;

@Schema()
export class Board {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: [String] })
  cardList: string[];

  @Prop({ type: String, required: true })
  admin: string;

  @Prop({ type: [String] })
  memberList: string[];

  @Prop({ type: [String] })
  imgSource: string[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);
