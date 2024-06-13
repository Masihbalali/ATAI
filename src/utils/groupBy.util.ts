export const groupBy = <T = any, K = string>(
  value: T[],
  key: string | ((item: T) => K),
): [K, T[]][] => {
  const map: Record<any, T[]> = {}

  for (const item of value) {
    const itemKey =
      typeof key === 'string' ? ((item as any)[key] as any) : key(item)

    map[itemKey] = [...(map[itemKey] || []), item]
  }

  return Object.entries(map) as [K, T[]][]
}
