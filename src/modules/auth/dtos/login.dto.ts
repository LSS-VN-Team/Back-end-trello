import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { IsEmail, IsString } from "class-validator";
// import { isString } from "lodash";


export class LoginDto{
    @ApiProperty()
    @IsOptional()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    password: string;
}