import { FileData } from '@/types/data.types'
import { settle } from '@/utils/async.utils'
import { groupBy } from '@/utils/groupBy.util'
import type { GetQueryBuilder } from '@unbody-io/ts-client/build/core/query-builder/GetQueryBuilder'
import { ApiChatMessage } from '.'
import {
  PROMPT_CHAT,
  PROMPT_CHAT_REFINE,
  PROMPT_PARSE_USER_PROMPT,
} from './prompts'
import { unbody } from './unbody.client'

const generateFromManyQuery = ({
  type,
  ids,
  prompt,
  concepts,
}: {
  type: string
  ids: string[]
  prompt: string
  concepts: string[]
}) => {
  let query: GetQueryBuilder<any> = unbody.get.textBlock

  if (type === 'TextDocument') {
    query = unbody.get.textBlock
      .select('__typename')
      .where(({ ContainsAny }) => ({
        document: {
          TextDocument: {
            id: ContainsAny(...ids),
          },
        },
      }))
      .generate.fromMany(prompt, ['tagName', 'html']) as GetQueryBuilder<any>
  } else if (type === 'GoogleDoc') {
    query = unbody.get.textBlock
      .select('__typename')
      .where(({ ContainsAny }) => ({
        document: {
          GoogleDoc: {
            id: ContainsAny(...ids),
          },
        },
      }))
      .generate.fromMany(prompt, ['tagName', 'html']) as GetQueryBuilder<any>
  } else if (type === 'ImageBlock') {
    query = unbody.get.imageBlock
      .select('__typename')
      .where(({ ContainsAny }) => ({
        id: ContainsAny(...ids),
      }))
      .generate.fromMany(prompt, [
        'originalName',
        'alt',
        'ext',
        'autoTypes',
        'autoOCR',
        'autoCaption',
        'url',
      ]) as GetQueryBuilder<any>
  } else if (type === 'AudioFile') {
    query = unbody.get.subtitleEntry
      .select('__typename')
      .where(({ ContainsAny }) => ({
        document: {
          SubtitleFile: {
            media: {
              AudioFile: {
                id: ContainsAny(...ids),
              },
            },
          },
        },
      }))
      .generate.fromMany(prompt, [
        'start',
        'end',
        'text',
      ]) as GetQueryBuilder<any>
  } else if (type === 'VideoFile') {
    query = unbody.get.subtitleEntry
      .select('__typename')
      .where(({ ContainsAny }) => ({
        document: {
          SubtitleFile: {
            media: {
              VideoFile: {
                id: ContainsAny(...ids),
              },
            },
          },
        },
      }))
      .generate.fromMany(prompt, [
        'start',
        'end',
        'text',
      ]) as GetQueryBuilder<any>
  }

  query = query.search.about(concepts).limit(50) as GetQueryBuilder<any>

  return query as GetQueryBuilder<any>
}

const generateFromFiles = async ({
  files,
  prompt,
  concepts,
}: {
  prompt: string
  files: FileData[]
  concepts: string[]
}) => {
  const grouped = groupBy(files, (f) => f.metadata.__typename)

  const queries = grouped.map(([type, group]) =>
    generateFromManyQuery({
      type,
      prompt,
      concepts,
      ids: group.map((f) => f.metadata.id),
    }),
  )

  const results = await Promise.all(queries.map((q) => q.exec()))
  return results.map((res) => (res.data as any).generate.result)
}

const multimodalChat = async (params: {
  prompt: string
  history?: ApiChatMessage[]
  files: FileData[]
}): Promise<ApiChatMessage> => {
  const history =
    (params.history || []).length > 0 ? JSON.stringify(params.history) : ''

  const prompt = PROMPT_CHAT(params.prompt, history)

  const [concepts, err] = await settle(() =>
    apiUtils
      .parseUserPrompt({
        prompt: params.prompt,
        history,
      })
      .then((res) => {
        if (
          typeof res === 'object' &&
          res.concepts &&
          Array.isArray(res.concepts) &&
          res.relatedKeywords &&
          Array.isArray(res.relatedKeywords)
        )
          return res

        return {
          concepts: [],
          relatedKeywords: [],
        }
      })
      .catch((e) => {
        console.log(e)
        return {
          concepts: [],
          relatedKeywords: [],
        }
      }),
  )

  const allConcepts = [
    ...(concepts?.concepts || []),
    ...(concepts?.concepts || []),
    ...(concepts?.concepts || []),
    (concepts?.relatedKeywords || []).join(' '),
  ].filter((c) => !!c && c.length > 0)

  const responses =
    allConcepts.length > 0
      ? await apiUtils.generateFromFiles({
          prompt,
          files: params.files,
          concepts: allConcepts,
        })
      : [await apiUtils.generate<string>(prompt)]

  if (responses.length === 0) {
    return {
      message:
        "I'm sorry, I don't have enough information to provide a response.",
      role: 'assistant',
    }
  }

  const res =
    responses.length > 1
      ? await apiUtils.generate<{
          response: string
          ids: string[]
        }>(PROMPT_CHAT_REFINE(params.prompt, JSON.stringify(responses)))
      : responses[0]

  return {
    message: res,
    role: 'assistant',
  }
}

const extractJson = <T = any>(text: string): T => {
  const json =
    text.match(/\`\`\`json\n([\s\S]+)\n[\s\S]*\`\`\`[\s\S\n]*$/)?.[1] || ''
  if (json && json.length > 0) return JSON.parse(json)

  return JSON.parse(text)
}

const generate = async <T = any>(
  prompt: string,
  opts?: {
    json?: boolean
  },
): Promise<T> => {
  const {
    data: {
      generate: { result },
    },
  } = await unbody.get.textBlock
    .select('__typename')
    .limit(1)
    .generate.fromMany(prompt, [''] as any)
    .exec()

  if (opts?.json) return extractJson<T>(result)

  return result as any as T
}

const parseUserPrompt = async (params: {
  prompt: string
  history?: string
}) => {
  const prompt = PROMPT_PARSE_USER_PROMPT(params.prompt, params.history)
  return generate<{
    concepts: string[]
    relatedKeywords: string[]
  }>(prompt, { json: true })
}

export const apiUtils = {
  generate,
  extractJson,
  multimodalChat,
  parseUserPrompt,
  generateFromFiles,
  generateFromManyQuery,
}
