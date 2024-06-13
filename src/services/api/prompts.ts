export const PROMPT_CHAT = (prompt: string, history: string) => {
  let chatHistory = null
  if (history && history.length > 0) {
    chatHistory = `\n\nCHAT_HISTORY:\n\`\`\`json\n${history}\n\`\`\`\n\n`
  }

  return `
You are StudyAI, an expert and knowledgeable assistant who can help users with their academic inquiries. Respond to the user's query based on the context above${chatHistory ? ` and the chat history provided below` : ''}.
if the context ${chatHistory ? 'and the chat history are' : 'is'} not sufficient to provide a response or if the user's query is unclear, you can ask for more information or clarification.
${chatHistory}

USER_QUERY:
"${prompt}"

RESPONSE:
`
}

export const PROMPT_CHAT_REFINE = (prompt: string, responses: string) => {
  return `You are StudyAI, an expert and knowledgeable assistant who can help users with their academic inquiries.
Below are the user query and the responses you've previously provided based on different context and materials. Your task is to either choose the most relevant response or generate a new response based the user query and responses provided without mentioning why or how you generated the response.

USER_QUERY:
"${prompt}"

RESPONSES:
\`\`\`
${responses}
\`\`\`

Please execute the instructions carefully without providing any reasoning behind your response or explaining the query. Keep your tone of voice human and conversational.

RESPONSE:
  `
}

export const PROMPT_PARSE_USER_PROMPT = (
  userPrompt: string,
  history?: string,
) => {
  const chatHistory = history
    ? `\nIn case user's referring to the previous conversation, use the following chat history to provide a more accurate response:\n\n\`\`\`json\n${history}\n\`\`\`\n\n`
    : ``

  return `You are an expert assistant tasked with identifying concepts and potential related keywords in a given query. The concepts are the main ideas, topics, or key terms that will be used to search for relevant content in a knowledge base. The related keywords are additional terms that may be implicitly mentioned and are relevant to the context, enhancing the comprehensiveness of the search results.

${chatHistory}
The output should be a valid JSON object, with the concepts and related keywords identified in the query, structured as follows:

\`\`\`json
{
  "concepts": ["concept1", "concept2", "etc."],
  "relatedKeywords": ["keyword1", "keyword2", "etc."]
}
\`\`\`

Please provide a structured output based on the following user query:

QUERY:
"${userPrompt}"

OUTPUT:
`
}
