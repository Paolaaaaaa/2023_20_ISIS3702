import { IsString, IsNotEmpty } from 'class-validator';

export class SaleDTO {
  
  @IsNotEmpty()
  readonly total: number;




}
