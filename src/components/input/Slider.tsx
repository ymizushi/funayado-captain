import React, { ChangeEventHandler } from "react";

type InputType = "text"

type Props = {
  value: number,
  onChange: (n: number) => void
  id: string,
  max: number
  min: number
}

export function VerticalSlider(props: Props) {
  return <input
    value={props.value}
    onChange={(e) => props.onChange(parseInt(e.target.value))}
    type={'text'}
    id={props.id}
  />
}
