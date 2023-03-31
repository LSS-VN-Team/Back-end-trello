import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { type } from 'os';

export type CommentDocument = HydratedDocument<CM>;
@Schema()
export class CM {
  @Prop({ type: String })
  idUser: string;

  @Prop({ type: String })
  idTask: string;

  @Prop({ type: String })
  content: string;
}
export const CommentSchema = SchemaFactory.createForClass(CM);
