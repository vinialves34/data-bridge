import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  POSTGRES_URL: z.string(),
  POSTGRES_PLAYGROUND: z.string().transform((val) => val === 'true'),
  MONGODB_URL: z.string(),
  MONGODB_DATABASE: z.string(),
  MONGODB_PLAYGROUND: z.string().transform((val) => val === 'true'),
});

export type Environment = z.infer<typeof envSchema>;

export function validate(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    console.error(
      'Error in environment variables:',
      z.treeifyError(result.error),
    );
    process.exit(1);
  }

  return result.data;
}
