import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import {
  SigninDto,
  SignupDto,
  UpdatePasswordDto,
  UpdateProfileDto,
} from './dto/users.dto';
import { AuthService } from './auth.service';
import { User, UserInfo } from '../../../common/decorators/user.decorator';

@Controller('user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/create')
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('/signin')
  async signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  @Post('/logout')
  @HttpCode(200)
  async logout(@User() user: UserInfo) {
    if (!user) throw new UnauthorizedException();

    return this.authService.logout(user.id);
  }

  @Get('/me')
  async me(@User() user: UserInfo) {
    if (!user) throw new UnauthorizedException();

    return this.authService.profile(user.id);
  }

  @Put('/update-profile')
  updateProfile(@User() user: UserInfo, @Body() body: UpdateProfileDto) {
    if (!user) throw new UnauthorizedException();

    return this.authService.updateProfile(user.id, body);
  }

  @Put('/update-password')
  updatePassword(@User() user: UserInfo, @Body() body: UpdatePasswordDto) {
    if (!user) throw new UnauthorizedException();

    return this.authService.updatePassword(user.id, body);
  }
}
