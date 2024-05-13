import env from '@pkgs/env'
import type { Movie } from '@pkgs/turso-db'

export async function getMovieDetails(id: number) {
  const response = await fetch(`${env.TMDB_API_URL}/movie/${id}`, {
    headers: { Authorization: `Bearer ${env.TMDB_ACCESS_TOKEN}` },
  })
  if (!response.ok) throw new Error(response.statusText)

  return (await response.json()) as Movie
}
