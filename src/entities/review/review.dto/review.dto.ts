import { IsString, IsNotEmpty, IsDate, IsNumber } from 'class-validator';

export class ReviewDTO {
  @IsString()
  @IsNotEmpty()
  readonly review: string;

  @IsString()
  @IsNotEmpty()
  readonly time: Date;

  @IsNumber()
  @IsNotEmpty()
  readonly stars: number;


}
