export const settle = async <R, E = Error>(
  promise: (() => Promise<R>) | Promise<R>,
): Promise<[R, undefined] | [undefined, E]> => {
  try {
    const result: R =
      typeof promise === 'function' ? await promise() : await promise
    return [result, undefined]
  } catch (error) {
    return [undefined, error as E]
  }
}
