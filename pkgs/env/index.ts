import { z } from 'zod'

export const envSchema = z.object({
  ASTRA_DB_API_ENDPOINT: z.string(),
  ASTRA_DB_APPLICATION_TOKEN: z.string(),
})

export type Env = z.infer<typeof envSchema>

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}

export default envSchema.parse(process.env)
