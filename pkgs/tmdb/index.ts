import env from '@pkgs/env'
import { moviesSchema } from '@pkgs/turso-db'

const tmdbOptions = {
  headers: { Authorization: `Bearer ${env.TMDB_ACCESS_TOKEN}` as const },
}

export async function getMovieDetails(id: number) {
  const response = await fetch(`${env.TMDB_API_URL}/movie/${id}`, tmdbOptions)
  if (!response.ok) throw new Error(response.statusText)

  return moviesSchema.parse(await response.json())
}
