import React, { PropsWithChildren }  from "react";

export function Text(props: PropsWithChildren) {
  return <p>
    {props.children}
  </p>
}