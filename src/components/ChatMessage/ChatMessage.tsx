import { Avatar } from '@nextui-org/react'
import clsx from 'clsx'
import React from 'react'
import { useAnimatedText } from '../AnimatedText'

export type ChatMessageProps = Omit<React.HTMLProps<HTMLDivElement>, 'role'> & {
  message: string
  role: 'user' | 'assistant'
  disableAnimation?: boolean
  setEditMessage: (editMessage: string) => void
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
                                                          message,
                                                          role,
                                                          disableAnimation = false,
                                                          setEditMessage,
                                                          ...props
                                                        }) => {
  const content = useAnimatedText(message, {
    maxTime: 1000,
    disabled: role === 'user' || disableAnimation,
  })

  const handleEdit = (text: string) => {
    setEditMessage(text)
  }
  return (
    <div {...props} className={clsx('', props.className)}>
      <div className="flex flex-row gap-4 items-center">
        <Avatar
          className="flex-shrink-0"
          showFallback
          color={role === 'assistant' ? 'primary' : 'default'}
          name={role === 'assistant' ? 'A' : ''}
          classNames={{
            name: 'text-[16px]',
          }}
        />
        <div className="flex-grow border border-gray-200 rounded-lg p-4 text-md bg-white shadow-sm mt-[-4px]">
          <div
            className="whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
        {
          role !== 'assistant' &&
          <button className={'bg-blue-500 h-full text-white p-2 rounded'} onClick={() => handleEdit(content)}>
            Edit
          </button>
        }

      </div>

    </div>
  )
}
