import { BusinessErrorsInterceptor } from '../../../shared/interceptors/business-errors/business-errors.interceptor';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { InstitutionEntity } from '../institution.entity/institution.entity';
import { InstitutionService } from '../institution.service/institution.service';
import { InstitutionDto } from '../institution.dto/institution.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('institutions')
@UseInterceptors(BusinessErrorsInterceptor)
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  @Get()
  async findAll() {
    return await this.institutionService.findAll();
  }

  @Get(':institutionId')
  async findById(@Param('institutionId') institutionId: string) {
    return await this.institutionService.findById(institutionId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() institutionDto: InstitutionDto) {
    const institution: InstitutionEntity = plainToInstance(
      InstitutionEntity,
      institutionDto,
    );
    return await this.institutionService.create(institution);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':institutionId')
  async update(
    @Param('institutionId') institutionId: string,
    @Body() institutionDto: InstitutionDto,
  ) {
    const institution: InstitutionEntity = plainToInstance(
      InstitutionEntity,
      institutionDto,
    );
    return await this.institutionService.update(institutionId, institution);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':institutionId')
  @HttpCode(204)
  async delete(@Param('institutionId') institutionId: string) {
    return await this.institutionService.delete(institutionId);
  }
}
