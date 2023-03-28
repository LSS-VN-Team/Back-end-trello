import { ApiProperty } from "@nestjs/swagger";
import { IsEAN, IsEmail, IsOptional } from "class-validator";

export class CardFilterDto{
    @ApiProperty({required:  false})
    @IsOptional()
    @IsEmail()
    name :string;

}