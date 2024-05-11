import env from '@pkgs/env'

export async function getMovieDetails(id: number) {
  const response = await fetch(`${env.TMDB_API_URL}/movie/${id}`)
  if (!response.ok) throw new Error(response.statusText)

  return await response.json()
}
