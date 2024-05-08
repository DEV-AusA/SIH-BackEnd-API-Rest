import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUpUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.authService.signUpUser(createUserDto);
  }

  @Post('signin')
  signInUser() {
    return;
  }

  @Post('google')
  signInUpUserGoogle() {
    return;
  }
}
