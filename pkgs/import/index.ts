import type { VectorDoc } from '@datastax/astra-db-ts'
import { getEmbedding } from '@pkgs/ai'
import { astraClient } from '@pkgs/astra-db'
import { getMovieDetails } from '@pkgs/tmdb'
import {
  db,
  moviesTable,
  type Genre,
  type Movie,
  type ProductionCompanies,
  type ProductionCountries,
  type SpokenLanguages,
} from '@pkgs/turso-db'
import { eq } from 'drizzle-orm'
import { parseArgs } from 'node:util'
import { z } from 'zod'

type MovieVectorProps =
  | 'id'
  | 'imdb_id'
  | 'original_title'
  | 'overview'
  | 'title'
  | 'runtime'
  | 'tagline'
  | 'status'
  | 'vote_average'
  | 'vote_count'
  | 'revenue'
  | 'release_date'
  | 'popularity'
  | 'budget'

interface MovieVector extends Pick<Movie, MovieVectorProps>, VectorDoc {
  belongs_to_collection: string | null
  genres: Genre[] | null
  production_companies: ProductionCompanies[] | null
  production_countries: ProductionCountries[] | null
  spoken_languages: SpokenLanguages[] | null
  combined: string
}

const moviesCollectionName = 'tmdb_movies'

export const updateMovieVectors = async (movie: Movie) => {
  const moviesCollection = await astraClient.getColection(moviesCollectionName)
  if (!moviesCollection) throw new Error('Collection not found in astra')

  const combined = `
    $title: ${movie.title}
    $genres: ${JSON.stringify(movie.genres ?? [])}
    $release_date: ${movie.release_date}
    $tagline: ${movie.tagline}
    $overview: ${movie.overview}
  `
  const $vector = await getEmbedding(combined)
  const astraId = await astraClient.insertOne<MovieVector>(moviesCollectionName, { ...movie, combined, $vector })
  console.log('Inserted movie into astra collection', astraId)

  const res = await db.update(moviesTable).set({ vector: $vector, astraId }).returning({ id: moviesTable.id }).run()
  console.log('Saved vector to turso db', res.rows.at(0)?.id)
}

export const importFromMovieId = async (movieId: number) => {
  const dbMovie = await db.query.movies.findFirst({ where: eq(moviesTable.id, movieId) })
  if (dbMovie) return

  const movie = await getMovieDetails(movieId)

  const res = await db.insert(moviesTable).values([movie]).returning({ id: moviesTable.id }).run()
  console.log('Saved movie to turso db', res.rows.at(0)?.id)
}

if (import.meta.main) {
  const argsSchema = z.object({ movieId: z.coerce.number().int().positive() })

  const args = parseArgs({
    args: Bun.argv,
    options: { movieId: { type: 'string' } },
    strict: true,
    allowPositionals: true,
  })

  const { movieId } = argsSchema.parse({ movieId: args.values.movieId ?? args.positionals.at(2) })

  await importFromMovieId(movieId)
}
