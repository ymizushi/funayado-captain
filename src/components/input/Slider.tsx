import React, { ChangeEventHandler } from "react";

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export type Props = {
  value: number
  min: number
  max: number
  onChange: (n: number) => void
}

export function VerticalRangeSlider(props: Props) {
  return <Slider 
    value={props.value}
    min={props.min}
    max={props.max}
    onChange={(n: number|number[]) => {
      if (typeof n == 'number') {
        props.onChange(n)
      }
    }}
  />
}
