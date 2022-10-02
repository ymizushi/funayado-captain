import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren & {
  onClick: () => Promise<void>
}

export function Button({onClick, children}: Props) {
  return <button onClick={onClick}>{children}</button>
}
