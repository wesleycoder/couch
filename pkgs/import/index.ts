import { getEmbedding } from '@pkgs/ai'
import { getMovieDetails } from '@pkgs/tmdb'
import { db, moviesTable, type Movie } from '@pkgs/turso-db'
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

const moviesCollectionName = 'tmdb_movies'

export const importFromMovieId = async (movieId: number) => {
  const dbMovie = await db.query.movies.findFirst({ where: eq(moviesTable.id, movieId) })
  if (dbMovie) return dbMovie

  const movie = await getMovieDetails(movieId)
  if (!movie) throw new Error(`Could not find movie with id ${movieId}`)

  return movie
}

const getMovieVector = async (movie: Movie) => {
  const vector = await getEmbedding(`
    $title: ${movie.title}
    $genres: ${JSON.stringify(movie.genres ?? [])}
    $release_date: ${movie.release_date}
    $tagline: ${movie.tagline}
    $overview: ${movie.overview}
  `)
  if (!vector) throw new Error(`Could not get vector for movie with id ${movie.id}`)

  return vector
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

  console.log('movieId', movieId)
  const movie = await importFromMovieId(movieId)
  console.log('movie', movie.title)
  console.log('vector', movie.vector?.length, movie.vector)
  await db.insert(moviesTable).values([movie]).returning({ id: moviesTable.id }).run()
}
