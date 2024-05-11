import { z } from 'zod'

export const envSchema = z.object({
  ASTRA_DB_API_ENDPOINT: z.string(),
  ASTRA_DB_APPLICATION_TOKEN: z.string(),
  TMDB_API_URL: z.string().default('https://api.themoviedb.org/3'),
  TMDB_API_KEY: z.string().optional(), // prefer access token
  TMDB_ACCESS_TOKEN: z.string(),
  TURSO_DB_TOKEN: z.string(),
  TURSO_DB_URL: z.string(),
})

export type Env = z.infer<typeof envSchema>

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}

export default envSchema.parse(process.env)
