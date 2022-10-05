import React, { PropsWithChildren } from "react";

export function Head(props: PropsWithChildren) {
  return <head>
    {props.children}
  </head>
}