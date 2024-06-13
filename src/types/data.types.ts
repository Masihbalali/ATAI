export type FileType =
  | 'folder'
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'pdf'

export type FileData = {
  id: string
  name: string
  type: FileType
  excerpt?: string
  tags?: string[]
  path: string[]
  extension?: string

  children?: FileData[]

  metadata: {
    id: string
    __typename: string
  }
}
