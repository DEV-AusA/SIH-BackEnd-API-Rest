import { Controller, Get, UseGuards } from '@nestjs/common';
import { SeedService } from './seed.service';

import {
  ApiBearerAuth,
  ApiExcludeController,
  ApiResponse,
} from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../helpers/roles.enum';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@ApiExcludeController()
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @ApiBearerAuth()
  @Get()
  @Roles(Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiResponse({
    status: 200,
    description: 'Seed de Usuarios y Propiedades cargados correctamente.',
  })
  @ApiResponse({ status: 401, description: 'Token invalido, no autorizado.' })
  exejutePreloadData() {
    const dataProps = this.seedService.preloadDataProperties();
    const dataUsers = this.seedService.preloadDataProperties();
    const DataEstablishments = this.seedService.preloadDataEstablishments();

    return { dataProps, dataUsers, DataEstablishments };
  }
}
