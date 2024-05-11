import { createClient } from '@libsql/client'
import env from '@pkgs/env'
import { drizzle } from 'drizzle-orm/libsql'
import { moviesTable } from './models/movies'

const client = createClient({ url: env.TURSO_DB_URL, authToken: env.TURSO_DB_TOKEN })

export const db = drizzle(client, {
  schema: {
    movies: moviesTable,
  },
})

export * from './models/movies'
