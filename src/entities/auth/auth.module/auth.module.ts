import { Module } from '@nestjs/common';

import { UserModule } from '../../user/user.module/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service/user.service';
import { AuthService } from '../auth.service/auth.service';
import constants from '../../../shared/security/constants';
import { LocalStrategy } from '../strategies/local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../user/user.entity/user.entity';
import { JwtStrategy } from '../strategies/jwt-strategy';
import { AdminStrategy } from '../strategies/admin.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: constants.JWT_SECRET,
      signOptions: { expiresIn: constants.JWT_EXPIRES_IN },
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],

  providers: [
    AuthService,
    UserService,
    JwtService,
    LocalStrategy,
    JwtStrategy,
    AdminStrategy,
  ],
  exports: [AuthService],
})
export class AuthoModule {}
