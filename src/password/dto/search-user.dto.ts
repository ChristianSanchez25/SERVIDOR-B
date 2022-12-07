import { IsString, IsNotEmpty, IsNumber } from "class-validator";


export class SearchUserDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsNumber()
    @IsNotEmpty()
    password: number;
}