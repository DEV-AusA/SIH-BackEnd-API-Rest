/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../modules/auth/auth.service';
import { User } from '../modules/users/entities/user.entity';
import { UsersService } from '../modules/users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {
    super();
  }
  serializeUser(user: User, done: Function) {
    done(null, user);
  }
  async deserializeUser(payload: User, done: Function) {
    const user = await this.userService.findUserById(payload.id);
    return user ? done(null, user) : done(null, null);
  }
}
