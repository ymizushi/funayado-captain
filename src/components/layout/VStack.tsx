import React, { PropsWithChildren } from "react";

export function VStack(props: PropsWithChildren) {
  return <div>
    {props.children}
  </div>
}