import clsx from 'clsx'
import React from 'react'

export type ChatLayoutProps = React.HTMLProps<HTMLDivElement> & {
  messageBar?: React.ReactNode
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({
  messageBar,
  className,
  children,
  ...props
}) => {
  return (
    <div className={clsx('h-screen overflow-hidden', className)} {...props}>
      <div
        className={clsx('h-full container mx-auto flex flex-col', className)}
      >
        <div className="flex-grow flex-shrink-0 pt-[40px] overflow-hidden flex flex-col">
          <div className="mt-1"></div>
          <div className="overflow-auto overflow-x-hidden flex-grow h-0 pe-2">
            {children}
          </div>
        </div>
        {messageBar}
      </div>
    </div>
  )
}
