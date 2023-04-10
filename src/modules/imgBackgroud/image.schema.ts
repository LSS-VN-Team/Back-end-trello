import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ImageDocument = HydratedDocument<Img>;

@Schema({ timestamps: true })
export class Img {
  // @Prop({ type: string })
  @Prop({ type: [String], required: true })
  url: string[];
}
export const ImageSchema = SchemaFactory.createForClass(Img);
