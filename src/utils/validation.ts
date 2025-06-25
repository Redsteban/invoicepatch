import { z } from 'zod';

export const TemplateSchema = z.object({
  name: z.string().min(1).max(100),
  rate: z.number().gt(0),
  hours: z.number().min(0.25).max(24),
  unit: z.enum(['hour', 'day']),
  ot_multiplier: z.number().optional(),
  description: z.string().optional(),
});

export function validateTemplate(input: any) {
  const result = TemplateSchema.safeParse({
    ...input,
    rate: typeof input.rate === 'string' ? parseFloat(input.rate) : input.rate,
    hours: typeof input.hours === 'string' ? parseFloat(input.hours) : input.hours,
    ot_multiplier: input.ot_multiplier === '' ? undefined : (typeof input.ot_multiplier === 'string' ? parseFloat(input.ot_multiplier) : input.ot_multiplier),
  });
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error.errors };
  }
} 