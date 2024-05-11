import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
interface FileHandleResponse {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
  // Otros campos que puedan ser relevantes para ti
}
@Injectable()
export class OptionalFileInterceptorIMG implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<FileHandleResponse> {
    const request = context.switchToHttp().getRequest();
    const file = request.file; // Obtener el archivo de la solicitud

    if (!file) {
      // Si no hay archivo, asignar null al campo 'file'
      request.file = null;
    }
    if (file) {
      // Validar el tipo de archivo
      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedFileTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          'El archivo debe ser una imagen de tipo JPEG, PNG o JPG',
        );
      }

      // Validar el tamaño del archivo
      const maxSize = 2000000; // 2MB
      if (file.size > maxSize) {
        throw new BadRequestException(
          'El tamaño del archivo debe ser menor a 2MB',
        );
      }
    }

    return next.handle().pipe(
      map((data) => {
        return {
          ...data, // return al cliente
        };
      }),
    );
  }
}
