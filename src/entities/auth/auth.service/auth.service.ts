import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../user/user.entity/user.entity';
import constants from '../../../shared/security/constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(name: string, password: string): Promise<any> {
    try {
      const user: UserEntity = await this.usersService.findOneUser(name);
      if (user && user.password === password) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (e) {
      except: return null;
    }
  }

  async login(req: any) {
    const payload = { username: req.user.username, sub: req.user.id };
    return {
      token: this.jwtService.sign(payload, {
        secret: constants.JWT_SECRET,
        expiresIn: constants.JWT_EXPIRES_IN,
      }),
    };
  }
}
