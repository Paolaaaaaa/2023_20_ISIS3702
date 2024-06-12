import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user.entity/user.entity';
import { UserService } from '../user.service/user.service';
import { UserController } from '../user.controller/user.controller';
import { AuthService } from '../../auth/auth.service/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, AuthService, JwtService],
  controllers: [UserController],
})
export class UserModule {}
