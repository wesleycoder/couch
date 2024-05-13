import { sql } from 'drizzle-orm'
import { int, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

const genreScheme = z.object({
  id: z.number(),
  name: z.string(),
})
export type Genre = z.infer<typeof genreScheme>

const productionCompaniesScheme = z.object({
  id: z.number(),
  logo_path: z.string().nullable(),
  name: z.string(),
  origin_country: z.string(),
})
export type ProductionCompanies = z.infer<typeof productionCompaniesScheme>

const productionCountriesScheme = z.object({
  iso_3166_1: z.string(),
  name: z.string(),
})
export type ProductionCountries = z.infer<typeof productionCountriesScheme>

const spokenLanguagesScheme = z.object({
  english_name: z.string(),
  iso_639_1: z.string(),
  name: z.string(),
})
export type SpokenLanguages = z.infer<typeof spokenLanguagesScheme>

export const moviesTable = sqliteTable('movies', {
  id: int('id').primaryKey(),
  adult: int('adult', { mode: 'boolean' }).default(false),
  backdrop_path: text('backdrop_path'),
  belongs_to_collection: text('belongs_to_collection'),
  budget: integer('budget'),
  genres: text('genres', { mode: 'json' }).$type<Genre[]>(),
  homepage: text('homepage'),
  imdb_id: text('imdb_id'),
  original_language: text('original_language'),
  original_title: text('original_title'),
  overview: text('overview'),
  popularity: integer('popularity').default(0),
  poster_path: text('poster_path'),
  production_companies: text('production_companies', { mode: 'json' }).$type<ProductionCompanies[]>(),
  production_countries: text('production_countries', { mode: 'json' }).$type<ProductionCountries[]>(),
  release_date: text('release_date'),
  revenue: integer('revenue').default(0),
  runtime: integer('runtime').default(0),
  spoken_languages: text('spoken_languages', { mode: 'json' }).$type<SpokenLanguages[]>(),
  status: text('status'),
  tagline: text('tagline'),
  title: text('title'),
  video: int('video', { mode: 'boolean' }).default(false),
  vote_average: integer('vote_average').default(0),
  vote_count: integer('vote_count').default(0),
  vector: text('vector', { mode: 'json' }).$type<number[]>(),
  astraId: text('astraId'),
  created_at: int('created_at', { mode: 'timestamp_ms' }).default(sql`(CURRENT_TIMESTAMP)`),
  updated_at: int('updated_at', { mode: 'timestamp_ms' })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => new Date()),
  deleted_at: int('deleted_at', { mode: 'timestamp_ms' }),
})

export const insertMoviesSchema = createInsertSchema(moviesTable)
export const moviesSchema = createSelectSchema(moviesTable, {
  genres: z.array(genreScheme),
  spoken_languages: z.array(spokenLanguagesScheme),
  production_companies: z.array(productionCompaniesScheme),
  production_countries: z.array(productionCountriesScheme),
  vector: z.array(z.number()),
})

export type NewMovie = z.infer<typeof insertMoviesSchema>
export type Movie = z.infer<typeof moviesSchema>
