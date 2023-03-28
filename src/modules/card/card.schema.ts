import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { type } from "os";

export type CardDocument = HydratedDocument<Card>;
@Schema()
export class Card{
    @Prop({type: String, required: true})
    name: string;

    @Prop({type: String})
    imgSource_card: string[];

    @Prop({type: String})
    describe: string;

    @Prop({type: [String]})
    taskList: string[];
}
export const CardSchema = SchemaFactory.createForClass(Card);
