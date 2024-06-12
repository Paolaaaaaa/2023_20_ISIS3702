import {IsNotEmpty, IsString, IsNumber} from 'class-validator';
export class InstitutionDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly address: string;

    @IsNotEmpty()
    @IsString()
    readonly phone: string;

    @IsNotEmpty()
    @IsString()
    readonly email: string;

    @IsNumber()
    @IsNotEmpty()
    readonly yearsOfExistence: number;

    @IsNotEmpty()
    @IsString()
    readonly schedule: string;

    @IsNotEmpty()
    @IsString()
    readonly type: string;

}
