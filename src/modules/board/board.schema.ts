import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BoardDocument = HydratedDocument<Board>;

@Schema()
export class Board {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: [String] })
  cardList: string[];

  @Prop({ type: String })
  admin: string;

  @Prop({ type: [String] })
  memberList: string[];

  @Prop({ type: [String] })
  imgSourd: string[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);
