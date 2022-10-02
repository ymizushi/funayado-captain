import React, { PropsWithChildren } from "react";

export function Component(props: PropsWithChildren) {
  return <div>{props.children}</div>
}