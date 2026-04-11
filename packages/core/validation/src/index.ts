// ============================================================
// @breeyard/validation — Zod v4 schema utilities
// ============================================================

import { z } from 'zod';

export { z };

// ---- Common field schemas ----

export const emailSchema = z.email();

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters');

export const slugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens');

export const uuidSchema = z.uuid();

export const idSchema = z.string().min(1);

export const centsSchema = z.number().int().nonnegative();

// ---- Pagination ----

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

// ---- Parse helpers ----

export const parseOrThrow = <T>(schema: z.ZodType<T>, data: unknown): T => schema.parse(data);

export const safeParse = <T>(
  schema: z.ZodType<T>,
  data: unknown,
): { success: true; data: T } | { success: false; errors: z.ZodError } => {
  const result = schema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, errors: result.error };
};

export const formatZodError = (error: z.ZodError): Record<string, string[]> => {
  const formatted: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.') || '_';
    formatted[path] ??= [];
    formatted[path].push(issue.message);
  }
  return formatted;
};
