import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthorizationsService } from './authorizations.service';
import { CreateAuthorizationDto } from './dto/create-authorization.dto';
import { UpdateAuthorizationDto } from './dto/update-authorization.dto';

@Controller('authorizations')
export class AuthorizationsController {
  constructor(private readonly authorizationsService: AuthorizationsService) {}

  @Post(':id')
  createNewAuthorization(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createAuthorizationDto: CreateAuthorizationDto,
  ) {
    return this.authorizationsService.createAuthorization(
      id,
      createAuthorizationDto,
    );
  }

  @Get()
  findAll() {
    return this.authorizationsService.findAllAuthorizations();
  }

  @Get(':number')
  findOneAuthorization(@Param('number') id: string) {
    return this.authorizationsService.findOneAuthorization(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAuthorizationDto: UpdateAuthorizationDto,
  ) {
    return this.authorizationsService.update(
      Number(id),
      updateAuthorizationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorizationsService.remove(Number(id));
  }
}
