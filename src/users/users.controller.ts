import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
  Delete,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { UserTokenDto } from './dto/accessToken.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('auth')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async findAllUser(@Query('email') email: string) {
    return await this.usersService.find(email);
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @Serialize(UserDto)
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다');
    return user;
  }

  @Serialize(UserDto)
  @Post('/signup')
  async signUp(@Body() body: CreateUserDto) {
    return await this.authService.signup(body.email, body.password);
  }

  @Serialize(UserTokenDto)
  @Post('/signin')
  async signIn(@Body() body: CreateUserDto) {
    const user = await this.authService.signin(body.email, body.password);
    if (!user) throw new UnauthorizedException('로그인 인증 실패');
    return user;
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
