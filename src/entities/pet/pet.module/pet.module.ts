import { Module, Type } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetEntity } from '../pet.entity/pet.entity';
import { PetService } from '../pet.service/pet.service';
import { PetController } from '../pet.controller/pet.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PetEntity])],
    providers: [PetService],
    controllers: [PetController],
})
export class PetModule {
}
