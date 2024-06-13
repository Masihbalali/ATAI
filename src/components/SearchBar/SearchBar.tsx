import { Button, Input, InputProps } from '@nextui-org/react'
import clsx from 'clsx'
import React from 'react'
import { SearchIcon } from '../icons'

export type SearchBarProps = Omit<
  React.HTMLProps<HTMLDivElement>,
  'value' | 'onChange'
> & {
  value?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onSubmit?: React.FormEventHandler<HTMLFormElement>
  pending?: boolean

  inputProps?: InputProps
  formProps?: React.HTMLProps<HTMLFormElement>
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  pending = false,
  onChange,
  onSubmit,
  inputProps = {},
  formProps = {},
  className,
  ...props
}) => {
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(e)
    }
  }

  return (
    <div className={clsx('w-full', className)} {...props}>
      <form
        className={clsx(formProps.className, 'w-full flex items-center gap-2')}
        onSubmit={onFormSubmit}
        {...formProps}
      >
        <Input
          placeholder="Search..."
          variant="bordered"
          radius="none"
          value={value}
          onChange={onChange}
          className={clsx(inputProps.className)}
          {...inputProps}
        />
        <Button
          isIconOnly
          radius="none"
          variant="solid"
          color="primary"
          className="fill-white"
          type="submit"
          isLoading={pending}
        >
          <SearchIcon />
        </Button>
      </form>
    </div>
  )
}
