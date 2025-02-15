import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service/auth.service';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'adminStrategy') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user || user.rol != 'Admin') {
      throw new UnauthorizedException();
    }
    return user;
  }
}
