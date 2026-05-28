import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export function createFormResolver<TSchema extends z.ZodTypeAny>(schema: TSchema) {
  return zodResolver(schema as never);
}

export function validateWithSchema<TSchema extends z.ZodTypeAny>(schema: TSchema, input: unknown) {
  return schema.safeParse(input);
}
