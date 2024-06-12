import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  Get,
  HttpCode,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../../../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { SaleService } from '../sale.service/sale.service';
import { SaleDTO } from '../sale.dto/sale.dto';
import { SaleEntity } from '../sale.entity/sale.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminAuthGuard } from '../../auth/guards/admin-auth.guard';

@Controller('sales')
@UseInterceptors(BusinessErrorsInterceptor)
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @UseGuards(AdminAuthGuard)
  @Get()
  async findall() {
    return await this.saleService.findAll();
  }
  @UseGuards(AdminAuthGuard)
  @Get(':saleId')
  async findOne(@Param('saleId') saleId: string) {
    return await this.saleService.findOne(saleId);
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() saleDTO: SaleDTO) {
    const user: SaleEntity = plainToInstance(SaleEntity, saleDTO);
    return await this.saleService.create(user);
  }



}
