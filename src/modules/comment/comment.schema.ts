import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { type } from 'os';

export type CommentDocument = HydratedDocument<CM>;
@Schema({ timestamps: true })
export class CM {
  @Prop({ type: String })
  idUser: string;

  @Prop({ type: String })
  idTask: string;

  @Prop({ type: String })
  content: string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}
export const CommentSchema = SchemaFactory.createForClass(CM);
