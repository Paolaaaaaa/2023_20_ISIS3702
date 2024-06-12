import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  Get,
  Put,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../user.service/user.service';
import { UserDTO } from '../user.dto/user.dto';
import { UserEntity } from '../user.entity/user.entity';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../../../shared/interceptors/business-errors.interceptors';
import { AuthService } from '..//../auth/auth.service/auth.service';
import { JwtAuthGuard } from '..//../auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '..//../auth/guards/local-auth.guard';
import { AdminAuthGuard } from '..//../auth/guards/admin-auth.guard';

@Controller('users')
@UseInterceptors(BusinessErrorsInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req);
  }

  @UseGuards(AdminAuthGuard)
  @Get()
  async findall() {
    return await this.userService.findAll();
  }


  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    return await this.userService.findOne(userId);
  }

  @Post()
  async create(@Body() userDto: UserDTO) {
    const user: UserEntity = plainToInstance(UserEntity, userDto);
    return await this.userService.create(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':userId')
  async update(@Param('userId') userId: string, @Body() userDTO: UserDTO) {
    const user: UserEntity = plainToInstance(UserEntity, userDTO);
    return await this.userService.update(userId, user);
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete(':userId')
  async delete(@Param('userId') userId: string) {
    return await this.userService.delete(userId);
  }
}
