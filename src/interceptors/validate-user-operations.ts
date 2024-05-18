import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  UnauthorizedException,
  Type,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../helpers/roles.enum';

interface DecodedToken {
  id: string;
  email: string;
  rol: Role;
  iat: number;
  exp: number;
}

@Injectable()
export class UserIdInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Type> {
    const request = context.switchToHttp().getRequest(); //obtiene el objeto request que viene en el contexto
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      throw new UnauthorizedException('Esta haciendo falta la autorizacion');
    }

    const tokenComplete = authorizationHeader.split(' ');
    if (tokenComplete.length !== 2 || tokenComplete[0] !== 'Bearer') {
      throw new UnauthorizedException('Autorizacion incompleta');
    }

    const token = tokenComplete[1];
    if (!token) {
      throw new UnauthorizedException('Token pendiente');
    }
    try {
      const decodedToken: DecodedToken = this.jwtService.verify(token); //un objeto con la informacion del token
      const tokenUserId = decodedToken.id; //se asigna el id del decodedToken a la variable tokenUserId
      const userRoles: Role = decodedToken.rol;

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
          'ID invalida para la operacion solicitada',
        );
      }
    } catch (error) {
      throw new BadRequestException('ID invalida para la operacion solicitada');
    }

    return next.handle();
  }
}
