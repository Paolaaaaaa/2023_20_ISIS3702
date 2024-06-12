import {IsNotEmpty, IsString, IsNumber} from 'class-validator';

export class PetDto {

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsNumber()
    readonly price: number;

    @IsNotEmpty()
    @IsNumber()
    readonly age: number;

    @IsNotEmpty()
    @IsString()
    readonly race: string;

    @IsNotEmpty()
    @IsString()
    readonly specie: string;

    @IsNotEmpty()
    @IsString()
    readonly color: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;
}