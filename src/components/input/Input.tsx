import React from "react";

import styles from "styles/components/input/Input.module.css";

type InputType = "text";

type Props = {
  value: string | number;
  onChange: <T extends string>(_value: T) => void;
  id: string;
  placeholder?: string;
  type?: InputType;
  name?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  size?: number;
  disabled?: boolean;
};

export function Input(props: Props) {
  return (
    <input
      className={styles.input}
      disabled={props.disabled}
      placeholder={props.placeholder}
      value={props.value}
      onChange={(event) => props.onChange(event.target.value)}
      type={props.type ?? "text"}
      id={props.id}
      name={props.name ?? props.id}
      required={props.required}
      minLength={props.minLength}
      maxLength={props.maxLength}
    />
  );
}
