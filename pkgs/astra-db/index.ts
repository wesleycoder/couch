import type { CreateCollectionOptions, SomeDoc } from '@datastax/astra-db-ts'
import env from '@pkgs/env'

const baseEndpoint = `${env.ASTRA_DB_API_ENDPOINT}/api/json/v1/${env.ASTRA_DB_KEYSPACE}`
const defaultFetchOptions = {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Token: env.ASTRA_DB_APPLICATION_TOKEN,
  },
}

const defaultCollectionOptions: CreateCollectionOptions<object> = {
  defaultId: {
    type: 'objectId',
  },
  indexing: { allow: ['*'] },
  vector: {
    dimension: env.OPENAI_DEFAULT_EMBED_DIMENSIONS,
    metric: 'cosine',
  },
}

export const astraClient = {
  async getColection(collectionName: string) {
    const response = await fetch(baseEndpoint, {
      ...defaultFetchOptions,
      body: JSON.stringify({
        findCollections: {
          options: {
            explain: true,
          },
        },
      }),
    })

    if (!response.ok) await astraClient.createCollection(collectionName)

    const res = await response.json()

    const collection = res?.status?.collections?.find?.((c: { name: string }) => c?.name === collectionName) as
      | { name: string }
      | undefined

    return collection ?? (await astraClient.createCollection(collectionName))
  },
  async createCollection<T extends SomeDoc>(
    collectionName: string,
    options: CreateCollectionOptions<T> = defaultCollectionOptions,
  ) {
    const response = await fetch(baseEndpoint, {
      ...defaultFetchOptions,
      body: JSON.stringify({
        createCollection: {
          name: collectionName,
          options: {
            ...defaultCollectionOptions,
            ...options,
          },
        },
      }),
    })

    if (!response.ok) return

    const res = await response.json()

    if (!res?.status?.ok) return

    return { name: collectionName }
  },
  async insertOne<T extends object>(collectionName: string, document: T) {
    const response = await fetch(`${baseEndpoint}/${collectionName}`, {
      ...defaultFetchOptions,
      body: JSON.stringify({ insertOne: { document } }),
    })

    if (!response.ok) throw new Error("Couldn't insert document")

    const res = await response.json()

    return res?.status?.insertedIds?.[0]?.$objectId ?? (res?.status?.insertedIds?.[0] as string | undefined)
  },
  async insertMany<T extends object>(collectionName: string, documents: T[]) {
    const response = await fetch(`${baseEndpoint}/${collectionName}/batch`, {
      ...defaultFetchOptions,
      body: JSON.stringify({ insertMany: { documents } }),
    })

    if (!response.ok) throw new Error("Couldn't insert documents")

    return response.json()
  },
}
