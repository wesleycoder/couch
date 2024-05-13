import 'dotenv/config'
import type { Config } from 'drizzle-kit'

export default {
  schema: './index.ts',
  out: './drizzle',
  driver: 'turso',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.TURSO_DB_URL,
    authToken: process.env.TURSO_DB_TOKEN,
  },
} satisfies Config
