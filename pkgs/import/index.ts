import { getEmbedding } from '@pkgs/ai'
import { movieCollection } from '@pkgs/astra-db'
import { getMovieDetails } from '@pkgs/tmdb'
import { db, moviesTable } from '@pkgs/turso-db'
import { parseArgs } from 'node:util'
import { z } from 'zod'

if (import.meta.main) {
  const argsSchema = z.object({
    movieId: z.coerce.number().int().positive(),
  })

  const args = parseArgs({
    args: Bun.argv,
    options: {
      movieId: {
        type: 'string',
      },
    },
    strict: true,
    allowPositionals: true,
  })

  args.positionals.shift()
  args.positionals.shift()

  const saneArgs = {
    movieId: args.values.movieId ?? args.positionals.at(0),
  }

  const { movieId } = argsSchema.parse(saneArgs)

  const movie = await getMovieDetails(movieId)

  await db.insert(moviesTable).values([movie]).run()

  const $vector = await getEmbedding(`
    $title: ${movie.title}
    $genres: ${JSON.stringify(movie.genres ?? [])}
    $release_date: ${movie.release_date}
    $tagline: ${movie.tagline}
    $overview: ${movie.overview}
  `)

  await movieCollection.insertOne({ ...movie, $vector })
}
