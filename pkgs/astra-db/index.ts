import { DataAPIClient, type VectorDoc } from '@datastax/astra-db-ts'
import env from '@pkgs/env'
import type { Movie } from '@pkgs/turso-db'

const client = new DataAPIClient(env.ASTRA_DB_APPLICATION_TOKEN, {
  dbOptions: {},
})

export const astraDB = client.db(env.ASTRA_DB_API_ENDPOINT)

console.log(`* Connected to AstraDB ${astraDB.id}`)

export const movieCollection = await astraDB.createCollection<Movie & VectorDoc>('tmdb_movies')

console.log(`* Created collection ${movieCollection.namespace}.${movieCollection.collectionName}`)

process.addListener('beforeExit', () => {
  console.log('* Closing connection to AstraDB...')
  client.close()
  console.log('* Bye!')
})
