/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../helpers/roles.enum';

@Injectable()
export class UserIdInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest(); //obtiene el objeto request que viene en el contexto
    const token = request.headers.authorization.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }
    try {
      const decodedToken: any = this.jwtService.verify(token); //un objeto con la informacion del token
      const tokenUserId = decodedToken.id; //se asigna el id del decodedToken a la variable tokenUserId
      const userRoles: Role[] = decodedToken.rol;

      if (
        userRoles.includes(Role.SuperAdmin) ||
        userRoles.includes(Role.Admin)
      ) {
        // Permitir a SuperAdmin y Admin saltarse la verificación de user ID
        return next.handle();
      }

      //evalua el Id que es extraido del decodedToken y asignado a la variable tokenUserId con el id que viene en objeto request.params.id
      if (tokenUserId !== request.params.id) {
        throw new BadRequestException(
          'Invalid user ID in token for this operation',
        );
      }
    } catch (error) {
      throw new BadRequestException(
        'Invalid user ID in token for this operation',
      );
    }

    return next.handle();
  }
}
