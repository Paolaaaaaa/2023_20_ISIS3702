import { IsString, IsNotEmpty, IsDate, IsNumber } from 'class-validator';

export class ReplyDTO {
  @IsString()
  @IsNotEmpty()
  readonly review: string;

  @IsString()
  @IsNotEmpty()
  readonly time: Date;



}