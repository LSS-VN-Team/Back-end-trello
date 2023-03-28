import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateBoardDto{
    @ApiProperty()
    @IsOptional()
    @IsString()
    name:string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    admin:string;

    // @ApiProperty()
    // @IsOptional()
    // @IsString()
    // memberList:string[];
}