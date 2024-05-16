import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Res,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-auth.dto';
import { LoginUserDto } from './dto/login-auth.dto';
import { GoogleAuthGuard } from '../../guards/google-guard.guard';
import { Request } from 'express';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUpUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUpUser(createUserDto);
  }

  @HttpCode(200)
  @Post('signin')
  signInUser(@Body() userLogin: LoginUserDto) {
    return this.authService.singInUser(userLogin);
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return {
      msg: 'Google Authentication',
    };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async loginOk(@Req() request: Request, @Res() res: Response) {
    const encodedData = encodeURIComponent(JSON.stringify(request.user));
    res.redirect(
      `${process.env.FRONT_HOST_NAME}/auth/google/redirect?state=${encodedData}`,
    );
    return 'Redirigiendo';
  }

  @Get('status')
  userStatus(@Req() request: Request) {
    if (request) {
      console.log(request.user);
      return { msg: request.user, status: 'Authenticated' };
    } else {
      return { msg: 'Not Authenticated' };
    }
  }
}
