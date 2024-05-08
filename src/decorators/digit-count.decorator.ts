import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'isEightDigits', async: false })
@Injectable()
export class IsEightDigits implements ValidatorConstraintInterface {
  validate(value: number) {
    if (typeof value !== 'number') {
      return false;
    }

    const stringValue = value.toString();
    return stringValue.length === 8 && /^\d+$/.test(stringValue);
  }

  defaultMessage() {
    return `document must be longer than or equal to 8 digits`;
  }
}
