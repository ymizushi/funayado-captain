import React from "react";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export type Props = {
  value: number;
  min: number;
  max: number;
  onChange: (_n: number) => void;
  disabled?: boolean;
};

export function VerticalRangeSlider(props: Props) {
  return (
    <Slider
      disabled={props.disabled ?? false}
      value={props.value}
      min={props.min}
      max={props.max}
      onChange={(n: number | number[]) => {
        if (typeof n == "number") {
          props.onChange(n);
        }
      }}
    />
  );
}
