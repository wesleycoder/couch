import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  TMDB_API_URL: z.string().default('https://api.themoviedb.org/3'),
  TMDB_ACCESS_TOKEN: z.string(),
  TURSO_DB_TOKEN: z.string(),
  TURSO_DB_URL: z.string(),
  DEFAULT_EMBED_SIZE: z.coerce.number().default(128),
})

export type Env = z.infer<typeof envSchema>

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}

export default envSchema.parse(process.env)
