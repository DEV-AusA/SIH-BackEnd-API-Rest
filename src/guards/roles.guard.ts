import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/helpers/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // obtengo los roles de la metadata con el reflector
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const hasRole = () => {
      return requiredRoles.some((role) => user?.rol?.includes(role));
    };

    console.log(user);
    console.log(user.rol);
    console.log(hasRole());

    const valid = user && user.rol && hasRole();

    if (!valid)
      throw new UnauthorizedException(
        'No tienes permisos para el acceso a esa Ruta',
      );

    return valid;
  }
}
