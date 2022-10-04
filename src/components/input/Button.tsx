import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren & {
  onClick: () => Promise<void>
  disabled?: boolean
}

export function Button({onClick, disabled, children}: Props) {
  return <button disabled={disabled} onClick={onClick}>{children}</button>
}
