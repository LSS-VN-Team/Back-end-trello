import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ImageDocument = HydratedDocument<Image>;

@Schema({ timestamps: true })
export class Image {
  @Prop({ type: String })
  name: string;

  @Prop({ type: [String], required: true })
  url: string[];
}
export const ImageSchema = SchemaFactory.createForClass(Image);
