import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export async function validateDto<T>(
  dtoClass: new () => T,
  plainObject: any
): Promise<{ isValid: boolean; errors?: string[] }> {
  const instance = plainToClass(dtoClass, plainObject);
  const errors: ValidationError[] = await validate(instance as object);

  if (errors.length === 0) {
    return { isValid: true };
  }

  const errorMessages = errors.flatMap((error) => {
    return Object.values(error.constraints || {});
  });

  return {
    isValid: false,
    errors: errorMessages,
  };
}

export function formatValidationErrors(errors: string[]): string {
  return errors.join(', ');
}
