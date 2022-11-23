import React from "react";

import styles from "styles/components/input/Select.module.css";

export type KV<T> = {
  key: string | number;
  name: string | number;
  value: T;
};

type SelectType<T> = {
  name: string;
  id: string;
  values: KV<T>[];
  onChange: (_value: KV<T>) => void;
  disabled?: boolean;
};

export function Select<T>({
  name,
  id,
  values,
  onChange,
  disabled,
}: SelectType<T>) {
  return (
    <select
      disabled={disabled}
      className={styles.select}
      name={name}
      id={id}
      onChange={(e) => {
        onChange(values.filter((kv) => kv.key === e.target.value)[0]);
      }}
    >
      {values.map((kv) => (
        <option className={styles.option} key={kv.key} value={kv.key}>
          {kv.name}
        </option>
      ))}
    </select>
  );
}
