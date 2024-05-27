import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsPositiveOrZero', async: false })
@Injectable()
export class IsPositiveOrZero implements ValidatorConstraintInterface {
  validate(value: number) {
    return typeof value === 'number' && value >= 0;
  }

  defaultMessage() {
    return 'El numero de teléfono fijo ingresado debe ser positivo';
  }
}
