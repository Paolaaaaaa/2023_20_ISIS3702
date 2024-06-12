import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PetService } from './entities/pet/pet.service/pet.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

}
