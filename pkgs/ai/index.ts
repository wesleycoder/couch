import env from '@pkgs/env'
import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  organization: env.OPENAI_ORG_ID,
  project: env.OPENAI_PROJECT_ID,
})

const defaultEmbeddingOptions = {
  model: env.OPENAI_DEFAULT_EMBED_MODEL,
  dimensions: env.OPENAI_DEFAULT_EMBED_DIMENSIONS,
}

export async function getEmbedding(
  input: string,
  opts: { model: string; dimensions: number } = defaultEmbeddingOptions,
) {
  const { data } = await openai.embeddings.create({ input, ...defaultEmbeddingOptions, ...opts })

  if (!data[0]?.embedding) throw new Error('No data returned from OpenAI')

  return data[0].embedding
}
