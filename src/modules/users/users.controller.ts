import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../auth/dto/create-auth.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 3) {
    return this.usersService.getUsers(Number(page), Number(limit));
  }

  @Get(':id')
  getUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUser(id);
  }

  @Put('update/:id')
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
  ) {
    console.log(id, updateUserDto);
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Put('unsubscribe/:id')
  unsubscribeUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.unsubscribeUser(id);
  }
}
