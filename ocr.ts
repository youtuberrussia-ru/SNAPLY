import { createWorker } from 'tesseract.js'

let workerPromise: ReturnType<typeof createWorker> | null = null

export async function recognizeText(image: File): Promise<string> {
  if (!workerPromise) workerPromise = createWorker('eng+rus')
  const worker = await workerPromise
  const result = await worker.recognize(image)
  return result.data.text.trim()
}