import { sql } from 'drizzle-orm'
import { int, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'

export const moviesTable = sqliteTable('movies', {
  id: int('id').primaryKey(),
  adult: int('adult', { mode: 'boolean' }).default(false),
  backdrop_path: text('backdrop_path'),
  belongs_to_collection: text('belongs_to_collection'),
  budget: integer('budget'),
  genres: text('genres', { mode: 'json' }),
  homepage: text('homepage'),
  imdb_id: text('imdb_id'),
  original_language: text('original_language'),
  original_title: text('original_title'),
  overview: text('overview'),
  popularity: integer('popularity').default(0),
  poster_path: text('poster_path'),
  production_companies: text('production_companies', { mode: 'json' }),
  production_countries: text('production_countries', { mode: 'json' }),
  release_date: text('release_date'),
  revenue: integer('revenue').default(0),
  runtime: integer('runtime').default(0),
  spoken_languages: text('spoken_languages', { mode: 'json' }),
  status: text('status'),
  tagline: text('tagline'),
  title: text('title'),
  video: int('video', { mode: 'boolean' }).default(false),
  vote_average: integer('vote_average').default(0),
  vote_count: integer('vote_count').default(0),
  created_at: int('created_at', { mode: 'timestamp_ms' }).default(sql`(CURRENT_TIMESTAMP)`),
  updated_at: int('updated_at', { mode: 'timestamp_ms' }).$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  deleted_at: int('deleted_at', { mode: 'timestamp_ms' }),
})

export const insertMoviesSchema = createInsertSchema(moviesTable)
export const moviesSchema = createSelectSchema(moviesTable)

export type NewMovie = z.infer<typeof insertMoviesSchema>
export type Movie = z.infer<typeof moviesSchema>
