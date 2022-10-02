
import React from "react";

export type KV = {
  key: string|number
  value: string|number
}

type SelectType = {
  name: string
  id: string
  values: KV[]
}

export function Select({name, id ,values}: SelectType) {
  return <select name={name} id={id}>
    {
      values.map((kv) => <option key={kv.key} value={kv.value}>{kv.value}</option>)
    }
  </select>
}