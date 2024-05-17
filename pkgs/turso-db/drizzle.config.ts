import env from '@pkgs/env'
import 'dotenv/config'
import type { Config } from 'drizzle-kit'

export default {
  schema: './index.ts',
  out: './drizzle',
  driver: 'turso',
  dialect: 'sqlite',
  dbCredentials: {
    url: env.TURSO_DB_URL,
    authToken: env.TURSO_DB_TOKEN,
  },
} satisfies Config
