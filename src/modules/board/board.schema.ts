import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BoardDocument = HydratedDocument<Board>;

@Schema({ timestamps: true })
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

  @Prop({ tpye: Date })
  createdAt: Date;

  @Prop({ tpye: Date })
  updateddAt: Date;

  @Prop({ type: Date })
  clickedAt: Date;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
