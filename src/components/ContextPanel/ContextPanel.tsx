import { FileData } from '@/types/data.types'
import { Chip } from '@nextui-org/react'
import clsx from 'clsx'
import React, { useState, useMemo } from 'react'
import {
  AudioFileIcon,
  DraftIcon,
  FolderIcon,
  ImageIcon,
  PdfFileIcon,
  VideoFileIcon,
} from '../icons'

const iconMap = {
  folder: FolderIcon,
  pdf: PdfFileIcon,
  document: DraftIcon,
  video: VideoFileIcon,
  audio: AudioFileIcon,
  image: ImageIcon,
}

export type ContextPanelProps = Omit<
  React.HTMLProps<HTMLDivElement>,
  'selected'
> & {
  selected: string[]
  compact?: boolean
  setFilterType: any
  map: Record<string, FileData>
}

export const ContextPanel: React.FC<ContextPanelProps> = ({
                                                            selected,
                                                            map,
                                                            compact = false,
                                                            setFilterType,
                                                            className,
                                                            ...props
                                                          }) => {
  const numberOfFiles = Object.values(map).filter(
    (f) => f.type !== 'folder',
  ).length

  const grouped = useMemo(() => {
    const groups = Object.fromEntries(
      Object.keys(iconMap)
        .filter((key) => key !== 'folder')
        .map((key) => [key, [] as FileData[]]),
    ) as Record<FileData['type'], FileData[]>

    selected.forEach((id) => {
      const item = map[id]
      if (!item) return

      groups[item.type].push(item)
    })

    return Object.entries(groups) as [FileData['type'], FileData[]][]
  }, [selected, map])

  const [activeChip, setActiveChip] = useState<string | null>(null)

  const handleFilter = (key: string) => {
    setFilterType(key)
    setActiveChip(key)
  }

  return (
    <div
      className={clsx(className, 'flex flex-row items-end justify-between')}
      {...props}
    >
      <div>
        <span
          className={clsx(compact && 'opacity-0', !compact && 'delay-[100ms]')}
        >
          {selected.length} of {numberOfFiles} items selected
        </span>
      </div>
      <div className="flex flex-row gap-1">
        {grouped.map(([key, items]) => {
          const IconComponent = iconMap[key]

          return (
            <Chip
              onClick={() => handleFilter(key)}
              key={key + items.length}
              variant="flat"
              className={clsx(
                'py-[20px] px-[16px] cursor-pointer',
                activeChip === key ? 'bg-[#4784ff]' : 'bg-[#ECECEC]',

                'duration-100',
                compact &&
                items.length === 0 && [
                  'opacity-0',
                  'overflow-hidden',
                  'absolute',
                ],
              )}
              title={`Selected ${items.length} ${key} file(s)`}
            >
              <span className="flex flex-row items-center gap-[6px]">
                <IconComponent className="fill-primary" />
                <span
                  className="flex items-center justify-center text-[20px] bg-primary text-white rounded-full w-[24px] h-[24px]">
                  {items.length}
                </span>
              </span>
            </Chip>
          )
        })}
      </div>
    </div>
  )
}
