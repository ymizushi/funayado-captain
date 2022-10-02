import React, { ChangeEventHandler } from "react";

type InputType = "text"

type Props = {
  value: string,
  onChange: ChangeEventHandler<HTMLInputElement>
  id: string,
  placeholder?: string
  type?: InputType,
  name?: string,
  required?: boolean
  minLength?: number
  maxLength?: number
  size?: number
}

export function Input(props: Props) {
  return <input
    placeholder={props.placeholder}
    value={props.value}
    onChange={props.onChange}
    type={props.type ?? 'text'}
    id={props.id}
    name={props.name ?? props.id}
    required={props.required}
    minLength={props.minLength}
    maxLength={props.maxLength}
    size={props.size ?? 2}
  />
}
