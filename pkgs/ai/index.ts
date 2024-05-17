import { LlamaCppEmbeddings } from '@langchain/community/embeddings/llama_cpp'
import env from '@pkgs/env'

const llamaPath = `${import.meta.dir}/models/en/zephyr-quiklang-3b-4k.Q2_K.gguf`

const embeddings = new LlamaCppEmbeddings({
  modelPath: llamaPath,
  embedding: true,
  contextSize: env.DEFAULT_EMBED_SIZE,
})

export const getEmbedding = embeddings.embedQuery.bind(embeddings)
