#!/usr/bin/env bun
import { downloadFile } from 'ipull'

const modelsDir = './models'
const models = [
  {
    url: 'https://huggingface.co/TheBloke/zephyr-quiklang-3b-4K-GGUF/resolve/main/zephyr-quiklang-3b-4k.Q2_K.gguf?download=true',
    lang: 'en',
  },
  {
    url: 'https://huggingface.co/noxinc/gemma-portuguese-tom-cat-2b-it-Q4_K_M-GGUF-PTBR/resolve/main/gemma-portuguese-tom-cat-2b-it.Q4_K_M.gguf?download=true',
    lang: 'pt-br',
  },
]

for await (const { url, lang } of models) {
  console.log(`Downloading ${lang} model...`)
  await (
    await downloadFile({
      url,
      directory: `${modelsDir}/${lang}`,
      cliProgress: true,
      skipExisting: true,
    })
  ).download()
}
