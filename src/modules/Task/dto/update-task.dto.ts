import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateTaskDto{
    @ApiProperty()
    @IsOptional()
    @IsString()
    title: string;
}