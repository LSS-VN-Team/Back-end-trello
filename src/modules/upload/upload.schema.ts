import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ImageDocument = HydratedDocument<Upload>;

@Schema({ timestamps: true })
export class Upload {
  @Prop({ type: [String], required: true })
  url: string[];
}
export const UpLoadSchema = SchemaFactory.createForClass(Upload);
