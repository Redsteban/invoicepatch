// TypeScript type for Template (stub)
export type Template = {
  id: string;
  user_id: string;
  name: string;
  content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// Zod schema for Template (stub)
import { z } from 'zod';
export const TemplateSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  name: z.string().min(1),
  content: z.string(),
  is_active: z.boolean().default(true),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
}); 