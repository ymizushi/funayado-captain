
import React from "react";

export type KV<T> = {
  key: string|number
  name: string|number
  value: T
}

type SelectType<T> = {
  name: string
  id: string
  values: KV<T>[]
  onChange: (value: KV<T>) => void
}

export function Select<T>({name, id ,values, onChange}: SelectType<T>) {
  return <select
   name={name}
   id={id}
   onChange={(e) => { onChange(values.filter(kv => kv.key === e.target.value)[0])}}
   >
    {
      values.map((kv) => <option key={kv.key} value={kv.key}>{kv.name}</option>)
    }
  </select>
}