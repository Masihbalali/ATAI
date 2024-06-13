import { FileData } from '@/types/data.types'
import { settle } from '@/utils/async.utils'
import { apiUtils } from '.'
import { ApiChatMessage } from './types'

export type ApiChatParams = {
  prompt: string
  history?: ApiChatMessage[]
  files: FileData[]
}

export type ApiChatResponse = {
  message: ApiChatMessage
}

export const chatApi = async (
  params: ApiChatParams,
): Promise<ApiChatResponse> => {
  const [msg, err] = await settle(() =>
    apiUtils.multimodalChat({
      files: params.files,
      prompt: params.prompt,
      history: params.history,
    }),
  )

  if (err || !msg) {
    if (err) console.error(err)

    return {
      message: {
        message: 'Failed to generate response.',
        role: 'assistant',
      },
    }
  }

  return {
    message: msg,
  }
}
