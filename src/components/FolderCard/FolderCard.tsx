import {
  Accordion,
  AccordionItem,
  AccordionItemProps,
  AccordionProps,
} from '@nextui-org/react'
import React from 'react'
import { FolderIcon } from '../icons/FolderIcon'

export type FolderCardProps = React.PropsWithChildren<{
  name: string
  label?: React.ReactNode | React.ReactNode[]

  itemProps?: Partial<AccordionItemProps>
}> &
  Partial<AccordionProps>

const dot = (
  <span className="inline-block w-1 h-1 bg-gray-500 mt-[2px] rounded-full"></span>
)

export const FolderCard: React.FC<FolderCardProps> = ({
  name,
  label,
  itemProps = {},
  children,
  ...props
}) => {
  const title = <div>{name}</div>
  const subtitle = (
    <span className="flex flex-row items-center gap-2">
      {label &&
        (Array.isArray(label)
          ? label.map((item, index) => (
              <React.Fragment key={index}>
                {item}
                {index < label.length - 1 && label.length > 1 && dot}
              </React.Fragment>
            ))
          : label)}
    </span>
  )

  const startContent = (
    <div className="flex flex-row items-center">
      {itemProps.startContent}
      <FolderIcon className="fill-primary-500 me-2" />
    </div>
  )

  return (
    <Accordion isCompact keepContentMounted {...props}>
      <AccordionItem
        key="1"
        title={title}
        subtitle={subtitle}
        {...itemProps}
        startContent={startContent}
      >
        <div className="w-full flex flex-col gap-2 ps-4">{children}</div>
      </AccordionItem>
    </Accordion>
  )
}
