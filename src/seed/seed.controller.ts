import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
// import { AuthGuard } from '../guards/auth.guard';
// import { RolesGuard } from '../guards/roles.guard';
// import { Roles } from '../decorators/roles.decorator';
// import { Role } from '../helpers/roles.enum';
import {
  ApiBearerAuth,
  ApiExcludeController,
  ApiResponse,
} from '@nestjs/swagger';

@ApiExcludeController()
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @ApiBearerAuth()
  @Get()
  // @Roles(Role.Admin)
  // @UseGuards(AuthGuard, RolesGuard)
  @ApiResponse({
    status: 200,
    description: 'Seed de Usuarios y Propiedades cargados correctamente.',
  })
  @ApiResponse({ status: 401, description: 'Token invalido, no autorizado.' })
  exejutePreloadData() {
    const dataProps = this.seedService.preloadDataProperties();
    const dataUsers = this.seedService.preloadDataProperties();

    return { dataProps, dataUsers };
  }
}
