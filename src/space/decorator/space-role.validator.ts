import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export default function ValidSpaceRole(
  validationOptions?: ValidationOptions,
  // eslint-disable-next-line @typescript-eslint/ban-types
): Function {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string): void => {
    registerDecorator({
      name: 'ValidSpaceRole',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          if (Array.isArray(value)) {
            const distinct = [
              // eslint-disable-next-line @typescript-eslint/ban-types
              ...new Set(value.map((v): Object => v['role'])),
            ];
            return distinct.length === 2;
          }
          return false;
        },
        defaultMessage(args: ValidationArguments): string {
          // console.log(JSON.stringify(args));
          return `${args.property} must contains entry for both user and manager`;
        },
      },
    });
  };
}
