// import {
//   registerDecorator,
//   ValidationOptions,
//   ValidationArguments,
// } from 'class-validator';

// export function IsNotEmail(validationOptions?: ValidationOptions) {
//   return function (object: Record<string, any>, propertyName: string) {
//     console.log(object);
//     registerDecorator({
//       name: 'isNotEmail',
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       validator: {
//         validate(value: string) {
//           const isEmail = value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
//           if (isEmail) {
//             return true;
//           }
//           const isMatches = value.match(/^[a-zA-Z0-9]+$/);
//           if (isMatches) {
//             return true;
//           }

//           return false;
//         },
//         defaultMessage(args: ValidationArguments) {
//           return `${args.property} no es un correo electrónico o username valido`;
//         },
//       },
//     });
//   };
// }

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'isNotEmailOrUsername', async: false })
@Injectable()
export class IsNotEmailOrUsername implements ValidatorConstraintInterface {
  validate(value: string) {
    const isEmail = value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    if (isEmail) {
      return true;
    }
    const isMatches = value.match(/^[a-zA-Z0-9]+$/);
    if (isMatches) {
      return true;
    }

    return false;
  }

  defaultMessage() {
    return `El valor no es un correo electrónico o username válido`;
  }
}
