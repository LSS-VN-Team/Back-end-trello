import { responseError, responseSuccess } from '@app/core/base/base.controller';
import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private readonly logger = new Logger(AuthController.name);
  @ApiOperation({ summary: 'Login' })
  @Post('login')
  async login(@Body() data: LoginDto) {
    try {
      const result = await this.authService.login(data);
      return responseSuccess(result);
    } catch (error) {
      console.log(error.message);
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @ApiOperation({ summary: 'Register' })
  @Post('register')
  async register(@Body() data: RegisterDto) {
    try {
      const result = await this.authService.register(data);
      return responseSuccess(result);
      //
    } catch (error) {
      console.log(error.message);
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }
}
